import PQueue from 'p-queue'
import type { Client } from '@notionhq/client'
import { parsePageId } from 'notion-utils'
import * as notion from 'notion-types'

import * as types from './types'

import { convertPage } from './convert-page'

export class NotionCompatAPI {
  client: Client

  constructor(client: Client) {
    this.client = client
  }

  public async getPage(rawPageId: string): Promise<notion.ExtendedRecordMap> {
    const pageId = parsePageId(rawPageId)

    const [page, block, children] = await Promise.all([
      this.client.pages.retrieve({ page_id: pageId }),
      this.client.blocks.retrieve({ block_id: pageId }),
      this.getAllBlockChildren(pageId)
    ])
    const { blockMap, blockChildrenMap, pageMap, parentMap } =
      await this.resolvePage(pageId)

    const recordMap = convertPage({
      pageId,
      blockMap,
      blockChildrenMap,
      pageMap,
      parentMap
    })

    ;(recordMap as any).raw = {
      page,
      block,
      children
    }

    return recordMap
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
    const parentMap: types.ParentMap = {}
    const blockChildrenMap: types.BlockChildrenMap = {}
    const pendingBlockIds = new Set<string>()
    const queue = new PQueue({ concurrency })

    const processBlock = async (blockId: string) => {
      if (!blockId || pendingBlockIds.has(blockId)) {
        return
      }

      pendingBlockIds.add(blockId)
      queue.add(async () => {
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
            }

            if (blockId !== rootBlockId) {
              // don't fetch children or recurse on subpages
              return
            }
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

              if (
                childBlock.has_children &&
                childBlock.type !== 'child_database'
              ) {
                processBlock(childBlock.id)
              }
            }
          }
        } catch (err) {
          console.warn('error resolving child blocks', blockId, err.message)
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
      parentMap
    }
  }

  async getAllBlockChildren(blockId: string) {
    let cursor = undefined
    let blocks: types.BlockChildren = []

    do {
      console.log('blocks.children.list', { blockId, cursor })
      const res = await this.client.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor
      })

      blocks = blocks.concat(res.results)
      cursor = res.next_cursor
    } while (cursor)

    return blocks
  }
}
