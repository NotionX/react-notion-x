import type { Client } from '@notionhq/client'
import type * as notion from 'notion-types'
import { parsePageId } from 'notion-utils'
import PQueue from 'p-queue'

import type * as types from './types'
import { convertCollection } from './convert-collection'
import { createDefaultCollectionView } from './convert-collection-view'
import { convertPage } from './convert-page'

export class NotionCompatAPI {
  client: Client

  constructor(client: Client) {
    this.client = client
  }

  public async getPage(
    rawPageId: string,
    options?: {
      /**
       * Set default full-width layout for pages
       * @default true for database pages, false for regular pages
       */
      fullWidth?: boolean
      /**
       * Set page font style
       * @default 'default'
       */
      pageFont?: 'default' | 'serif' | 'mono'
      /**
       * Set small text mode
       * @default false
       */
      smallText?: boolean
      /**
       * Automatically fetch database entries and include in collection_query
       * @default true
       */
      fetchDatabaseEntries?: boolean
      /**
       * Maximum entries to fetch per database
       * @default 100
       */
      maxDatabaseEntries?: number
      /**
       * Concurrency for fetching nested blocks
       * @default 4
       */
      concurrency?: number
    }
  ): Promise<notion.ExtendedRecordMap> {
    const pageId = parsePageId(rawPageId)
    if (!pageId) {
      throw new Error(`Invalid page id "${rawPageId}"`)
    }

    const [page, block, children] = await Promise.all([
      this.client.pages.retrieve({ page_id: pageId }),
      this.client.blocks.retrieve({ block_id: pageId }),
      this.getAllBlockChildren(pageId)
    ])
    const { blockMap, blockChildrenMap, pageMap, databaseMap, parentMap } =
      await this.resolvePage(pageId, {
        concurrency: options?.concurrency
      })

    const recordMap = await convertPage({
      pageId,
      blockMap,
      blockChildrenMap,
      pageMap,
      databaseMap,
      parentMap,
      fullWidth: options?.fullWidth,
      pageFont: options?.pageFont,
      smallText: options?.smallText,
      fetchDatabaseEntries: options?.fetchDatabaseEntries ?? true,
      maxDatabaseEntries: options?.maxDatabaseEntries ?? 100,
      notionClient: this.client
    })

    ;(recordMap as any).raw = {
      page,
      block,
      children
    }

    return recordMap
  }

  public async getDatabase(databaseId: string): Promise<{
    collection: notion.Collection
    collectionView: notion.CollectionView
  }> {
    const database = await this.client.databases.retrieve({
      database_id: databaseId
    })

    const typedDatabase = database as types.Database
    const collection = convertCollection(typedDatabase)
    const collectionView = createDefaultCollectionView(databaseId, 'table')

    return {
      collection,
      collectionView
    }
  }

  public async queryDatabase(
    databaseId: string,
    options?: {
      filter?: any
      sorts?: any[]
      pageSize?: number
    }
  ): Promise<types.DatabaseQueryResponse> {
    return this.client.databases.query({
      database_id: databaseId,
      filter: options?.filter,
      sorts: options?.sorts,
      page_size: options?.pageSize || 100
    })
  }

  async resolvePage(
    rootBlockId: string,
    {
      concurrency = 4
    }: {
      concurrency?: number
    } = {}
  ) {
    const blockMap: types.BlockMap = {}
    const pageMap: types.PageMap = {}
    const databaseMap: types.DatabaseMap = {}
    const parentMap: types.ParentMap = {}
    const blockChildrenMap: types.BlockChildrenMap = {}
    const pendingBlockIds = new Set<string>()
    const queue = new PQueue({ concurrency })

    const processBlock = async (
      blockId: string,
      { shallow = false }: { shallow?: boolean } = {}
    ) => {
      if (!blockId || pendingBlockIds.has(blockId)) {
        return
      }

      pendingBlockIds.add(blockId)
      void queue.add(async () => {
        try {
          let partialBlock = blockMap[blockId]
          if (!partialBlock) {
            partialBlock = await this.client.blocks.retrieve({
              block_id: blockId
            })
            blockMap[blockId] = partialBlock
          }

          const block = partialBlock as types.Block

          if (block.type === 'child_page') {
            if (!pageMap[blockId]) {
              const partialPage = await this.client.pages.retrieve({
                page_id: blockId
              })

              pageMap[blockId] = partialPage

              const page = partialPage as types.Page
              switch (page.parent?.type) {
                case 'page_id':
                  void processBlock(page.parent.page_id, {
                    shallow: true
                  })
                  if (!parentMap[blockId]) {
                    parentMap[blockId] = page.parent.page_id
                  }
                  break

                case 'database_id':
                  void processBlock(page.parent.database_id, {
                    shallow: true
                  })
                  if (!parentMap[blockId]) {
                    parentMap[blockId] = page.parent.database_id
                  }
                  break
              }
            }

            if (blockId !== rootBlockId) {
              // don't fetch children or recurse on subpages
              return
            }
          }

          if (block.type === 'child_database') {
            if (!databaseMap[blockId]) {
              try {
                const database = await this.client.databases.retrieve({
                  database_id: blockId
                })
                databaseMap[blockId] = database
              } catch (err: any) {
                console.warn('failed resolving database', blockId, err.message)
              }
            }
            // Don't fetch children of databases - they're queried separately
            return
          }

          if (shallow) {
            return
          }

          const children = await this.getAllBlockChildren(blockId)
          blockChildrenMap[blockId] = children.map((child) => child.id)

          for (const child of children) {
            const childBlock = child as types.Block
            const mappedChildBlock = blockMap[child.id] as types.Block
            if (
              !mappedChildBlock ||
              (!mappedChildBlock.type && childBlock.type)
            ) {
              blockMap[child.id] = childBlock
              parentMap[child.id] = blockId

              const details: any =
                childBlock[childBlock.type as keyof types.Block]
              if (details?.rich_text) {
                const richTextMentions = details.rich_text.filter(
                  (richTextItem: types.RichTextItem) =>
                    richTextItem.type === 'mention'
                )

                for (const richTextMention of richTextMentions) {
                  switch (richTextMention.mention?.type) {
                    case 'page': {
                      const pageId = richTextMention.mention.page.id
                      void processBlock(pageId, { shallow: true })
                      break
                    }

                    case 'database': {
                      const databaseId = richTextMention.mention.database.id
                      void processBlock(databaseId, { shallow: true })
                      break
                    }
                  }
                }
              }

              if (childBlock.type === 'link_to_page') {
                switch (childBlock.link_to_page?.type) {
                  case 'page_id':
                    void processBlock(childBlock.link_to_page.page_id, {
                      shallow: true
                    })
                    break

                  case 'database_id':
                    void processBlock(childBlock.link_to_page.database_id, {
                      shallow: true
                    })
                    break
                }
              }

              if (
                childBlock.has_children &&
                childBlock.type !== 'child_database'
              ) {
                void processBlock(childBlock.id)
              }
            }
          }
        } catch (err: any) {
          console.warn('failed resolving block', blockId, err.message)
        } finally {
          pendingBlockIds.delete(blockId)
        }
      })
    }

    await processBlock(rootBlockId)
    await queue.onIdle()

    return {
      blockMap,
      blockChildrenMap,
      pageMap,
      databaseMap,
      parentMap
    }
  }

  async getAllBlockChildren(blockId: string) {
    let blocks: types.BlockChildren = []
    let cursor: string | undefined

    do {
      const res = await this.client.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor
      })

      blocks = blocks.concat(res.results)
      if (!res.next_cursor) break

      cursor = res.next_cursor
    } while (cursor)

    return blocks
  }
}
