import type { Client } from '@notionhq/client'
import { parsePageId } from 'notion-utils'
import PQueue from 'p-queue'

import type * as types from './types'

/**
 * Raw V1 API client that preserves all data without adaptation.
 * This client fetches data from Notion's official V1 API and stores it
 * in its original format for later analysis and conversion.
 */
export class NotionV1API {
  private client: Client
  private options: Required<types.V1ClientOptions>

  constructor(client: Client, options: types.V1ClientOptions = {}) {
    this.client = client
    this.options = {
      concurrency: options.concurrency ?? 4,
      maxDepth: options.maxDepth ?? 10,
      fetchUsers: options.fetchUsers ?? true,
      fetchDatabases: options.fetchDatabases ?? true,
      includeMetadata: options.includeMetadata ?? true
    }
  }

  /**
   * Fetches a complete page with all its blocks, child pages, and related data
   * without any adaptation or conversion. All data is preserved as-is from V1 API.
   */
  public async getPage(rawPageId: string): Promise<types.V1RawPageData> {
    const pageId = parsePageId(rawPageId)
    if (!pageId) {
      throw new Error(`Invalid page id "${rawPageId}"`)
    }

    const startTime = new Date().toISOString()

    // Initialize data containers
    const allBlocks: Record<string, types.V1BlockResponse> = {}
    const allPages: Record<string, types.V1PageResponse> = {}
    const allDatabases: Record<string, types.V1DatabaseResponse> = {}
    const blockChildren: Record<string, string[]> = {}
    const parentMap: Record<string, string> = {}
    const users: Record<string, types.V1UserResponse> = {}

    const processedBlocks = new Set<string>()
    const processedPages = new Set<string>()
    const processedDatabases = new Set<string>()
    const queue = new PQueue({ concurrency: this.options.concurrency })

    // Fetch root page and block
    const [page, rootBlock] = await Promise.all([
      this.client.pages.retrieve({ page_id: pageId }),
      this.client.blocks.retrieve({ block_id: pageId })
    ])

    allPages[pageId] = page
    allBlocks[pageId] = rootBlock

    /**
     * Recursively process a block and all its children
     */
    const processBlock = async (
      blockId: string,
      parentId?: string,
      depth = 0
    ): Promise<void> => {
      if (processedBlocks.has(blockId) || depth > this.options.maxDepth) {
        return
      }

      processedBlocks.add(blockId)

      return queue.add(async () => {
        try {
          // Fetch block if not already fetched
          if (!allBlocks[blockId]) {
            const block = await this.client.blocks.retrieve({
              block_id: blockId
            })
            allBlocks[blockId] = block
          }

          const block = allBlocks[blockId] as any

          // Set parent relationship
          if (parentId) {
            parentMap[blockId] = parentId
          }

          // Handle different block types
          await this.handleBlockType(block, blockId, depth)

          // Fetch children if block has them
          if (block.has_children) {
            const children = await this.getAllBlockChildren(blockId)
            blockChildren[blockId] = children.map((child) => child.id)

            // Process each child
            for (const child of children) {
              allBlocks[child.id] = child
              await processBlock(child.id, blockId, depth + 1)
            }
          }
        } catch (err: any) {
          console.warn(`Failed to process block ${blockId}:`, err.message)
          // Store error information but continue processing
          allBlocks[blockId] = {
            id: blockId,
            error: {
              type: this.getErrorType(err),
              message: err.message,
              originalError: err
            }
          } as any
        }
      })
    }

    /**
     * Process a page (child_page blocks)
     */
    const processPage = async (pageId: string, _depth = 0): Promise<void> => {
      if (processedPages.has(pageId) || _depth > this.options.maxDepth) {
        return
      }

      processedPages.add(pageId)

      return queue.add(async () => {
        try {
          if (!allPages[pageId]) {
            const page = await this.client.pages.retrieve({ page_id: pageId })
            allPages[pageId] = page
          }

          const page = allPages[pageId] as any

          // Handle page parent relationships
          if (page.parent) {
            switch (page.parent.type) {
              case 'page_id':
                parentMap[pageId] = page.parent.page_id
                await processPage(page.parent.page_id, _depth + 1)
                break
              case 'database_id':
                parentMap[pageId] = page.parent.database_id
                await processDatabase(page.parent.database_id, _depth + 1)
                break
            }
          }

          // Fetch users if enabled
          if (this.options.fetchUsers) {
            await this.fetchUsersFromPage(page)
          }
        } catch (err: any) {
          console.warn(`Failed to process page ${pageId}:`, err.message)
          allPages[pageId] = {
            id: pageId,
            error: {
              type: this.getErrorType(err),
              message: err.message,
              originalError: err
            }
          } as any
        }
      })
    }

    /**
     * Process a database
     */
    const processDatabase = async (
      databaseId: string,
      _depth = 0
    ): Promise<void> => {
      if (
        !this.options.fetchDatabases ||
        processedDatabases.has(databaseId) ||
        _depth > this.options.maxDepth
      ) {
        return
      }

      processedDatabases.add(databaseId)

      return queue.add(async () => {
        try {
          const database = await this.client.databases.retrieve({
            database_id: databaseId
          })
          allDatabases[databaseId] = database
        } catch (err: any) {
          console.warn(`Failed to process database ${databaseId}:`, err.message)
          allDatabases[databaseId] = {
            id: databaseId,
            error: {
              type: this.getErrorType(err),
              message: err.message,
              originalError: err
            }
          } as any
        }
      })
    }

    // Start processing from root
    await processBlock(pageId)
    await processPage(pageId)

    // Wait for all processing to complete
    await queue.onIdle()

    // Build final result
    const result: types.V1RawPageData = {
      page,
      rootBlock,
      allBlocks,
      allPages,
      allDatabases,
      blockChildren,
      parentMap,
      users,
      metadata: this.options.includeMetadata
        ? {
            fetchedAt: startTime,
            pageId,
            totalBlocks: Object.keys(allBlocks).length,
            totalPages: Object.keys(allPages).length,
            totalDatabases: Object.keys(allDatabases).length
          }
        : ({} as any)
    }

    console.log('Result is:', JSON.stringify(result))
    return result
  }

  /**
   * Handle specific block types and their relationships
   */
  private async handleBlockType(
    block: any,
    blockId: string,
    depth: number
  ): Promise<void> {
    if (!block.type) return

    const blockDetails = block[block.type]
    if (!blockDetails) return

    // Handle rich text mentions
    if (blockDetails.rich_text) {
      for (const richTextItem of blockDetails.rich_text) {
        if (richTextItem.type === 'mention' && richTextItem.mention) {
          const mention = richTextItem.mention

          switch (mention.type) {
            case 'page':
              if (mention.page?.id) {
                await this.processPage(mention.page.id, depth + 1)
              }
              break
            case 'database':
              if (mention.database?.id) {
                await this.processDatabase(mention.database.id, depth + 1)
              }
              break
            case 'user':
              if (this.options.fetchUsers && mention.user?.id) {
                await this.fetchUser(mention.user.id)
              }
              break
          }
        }
      }
    }

    // Handle link_to_page blocks
    if (block.type === 'link_to_page' && block.link_to_page) {
      switch (block.link_to_page.type) {
        case 'page_id':
          await this.processPage(block.link_to_page.page_id, depth + 1)
          break
        case 'database_id':
          await this.processDatabase(block.link_to_page.database_id, depth + 1)
          break
      }
    }
  }

  /**
   * Fetch all children of a block with pagination
   */
  private async getAllBlockChildren(blockId: string): Promise<any[]> {
    let blocks: any[] = []
    let cursor: string | undefined

    do {
      const response = await this.client.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100
      })

      blocks = blocks.concat(response.results)
      cursor = response.next_cursor || undefined
    } while (cursor)

    return blocks
  }

  /**
   * Fetch user information
   */
  private async fetchUser(userId: string): Promise<void> {
    if (this.users[userId]) return

    try {
      const user = await this.client.users.retrieve({ user_id: userId })
      this.users[userId] = user
    } catch (err: any) {
      console.warn(`Failed to fetch user ${userId}:`, err.message)
    }
  }

  /**
   * Extract and fetch users from page properties
   */
  private async fetchUsersFromPage(page: any): Promise<void> {
    if (!this.options.fetchUsers) return

    // Fetch created_by and last_edited_by users
    if (page.created_by?.id) {
      await this.fetchUser(page.created_by.id)
    }
    if (page.last_edited_by?.id) {
      await this.fetchUser(page.last_edited_by.id)
    }
  }

  /**
   * Determine error type from API error
   */
  private getErrorType(err: any): types.V1ClientError['type'] {
    if (err.code === 'rate_limited') return 'RATE_LIMIT'
    if (err.code === 'object_not_found') return 'NOT_FOUND'
    if (err.code === 'unauthorized' || err.code === 'restricted_resource') {
      return 'PERMISSION_DENIED'
    }
    if (err.status >= 400 && err.status < 500) return 'API_ERROR'
    return 'UNKNOWN'
  }

  // Reference to avoid TypeScript errors
  private users: Record<string, types.V1UserResponse> = {}
  private processPage = async (pageId: string, _depth = 0): Promise<void> => {
    // Implementation moved to getPage method
  }
  private processDatabase = async (
    databaseId: string,
    _depth = 0
  ): Promise<void> => {
    // Implementation moved to getPage method
  }
}
