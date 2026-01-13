import type { Client } from '@notionhq/client'
import type * as notion from 'notion-types'

import type * as types from './types'
import { convertBlock } from './convert-block'
import { convertCollection } from './convert-collection'
import { createDefaultCollectionView } from './convert-collection-view'

export async function convertPage({
  pageId,
  blockMap,
  blockChildrenMap,
  pageMap,
  databaseMap,
  parentMap,
  fullWidth,
  pageFont,
  smallText,
  fetchDatabaseEntries = true,
  maxDatabaseEntries = 100,
  notionClient
}: {
  pageId: string
  blockMap: types.BlockMap
  blockChildrenMap: types.BlockChildrenMap
  pageMap: types.PageMap
  databaseMap: types.DatabaseMap
  parentMap: types.ParentMap
  fullWidth?: boolean
  pageFont?: 'default' | 'serif' | 'mono'
  smallText?: boolean
  fetchDatabaseEntries?: boolean
  maxDatabaseEntries?: number
  notionClient?: Client
}): Promise<notion.ExtendedRecordMap> {
  const compatBlocks = Object.values(blockMap).map((block) =>
    convertBlock({
      block,
      children: blockChildrenMap[block.id],
      pageMap,
      blockMap,
      parentMap
    })
  )

  const compatPageBlock = convertPageBlock({
    pageId,
    blockMap,
    blockChildrenMap,
    pageMap,
    databaseMap,
    parentMap,
    fullWidth,
    pageFont,
    smallText
  })

  const compatPageBlocks = Object.keys(pageMap)
    .filter((id) => id !== pageId)
    .map((id) =>
      convertPageBlock({
        pageId: id,
        blockMap,
        blockChildrenMap,
        pageMap,
        databaseMap,
        parentMap,
        fullWidth,
        pageFont,
        smallText
      })
    )

  const compatBlockMap = Object.fromEntries(
    [compatPageBlock, ...compatBlocks, ...compatPageBlocks]
      .filter(Boolean)
      .map((block) => [
        block!.id,
        {
          type: 'reader',
          value: block!
        }
      ])
  )

  // Convert databases to collections
  const collectionMap: notion.CollectionMap = {}
  const collectionViewMap: notion.CollectionViewMap = {}
  const collectionQuery: any = {}

  for (const [databaseId, database] of Object.entries(databaseMap)) {
    const typedDatabase = database as types.Database
    const collection = convertCollection(typedDatabase)
    const collectionView = createDefaultCollectionView(databaseId, 'table')

    collectionMap[databaseId] = {
      role: 'reader',
      value: collection
    }

    collectionViewMap[collectionView.id] = {
      role: 'reader',
      value: collectionView
    }

    // Fetch database entries if requested
    if (fetchDatabaseEntries && notionClient) {
      try {
        const queryResult = await notionClient.databases.query({
          database_id: databaseId,
          page_size: maxDatabaseEntries
        })

        // Build collection query result
        const blockIds = queryResult.results.map((page: any) => page.id)

        collectionQuery[databaseId] = {
          [collectionView.id]: {
            type: collectionView.type,
            total: queryResult.results.length,
            blockIds,
            aggregationResults: [],
            collection_group_results: {
              type: 'results',
              blockIds,
              hasMore: !!queryResult.has_more
            }
          }
        }

        // Add database pages to pageMap so they're included in the recordMap
        for (const result of queryResult.results) {
          if (!pageMap[result.id]) {
            pageMap[result.id] = result as any
          }
        }
      } catch (err: any) {
        console.warn(`Failed to query database ${databaseId}:`, err.message)
      }
    }
  }

  return {
    block: compatBlockMap as any,
    collection: collectionMap,
    collection_view: collectionViewMap,
    collection_query: collectionQuery,
    signed_urls: {},
    notion_user: {}
  }
}

export function convertPageBlock({
  pageId,
  blockMap,
  blockChildrenMap,
  pageMap,
  databaseMap: _databaseMap,
  parentMap,
  fullWidth,
  pageFont,
  smallText
}: {
  pageId: string
  blockMap: types.BlockMap
  blockChildrenMap: types.BlockChildrenMap
  pageMap: types.PageMap
  databaseMap: types.DatabaseMap
  parentMap: types.ParentMap
  fullWidth?: boolean
  pageFont?: 'default' | 'serif' | 'mono'
  smallText?: boolean
}): notion.Block | null {
  const partialPage = pageMap[pageId]
  const page = partialPage as types.Page

  if (page) {
    const compatPageBlock = convertBlock({
      block: { ...page, type: 'child_page' } as unknown as types.Block,
      children: blockChildrenMap[page.id],
      pageMap,
      blockMap,
      parentMap
    })

    // Apply page format settings
    if (compatPageBlock && compatPageBlock.format) {
      // Apply full-width setting
      if (fullWidth !== undefined) {
        compatPageBlock.format.page_full_width = fullWidth
      } else {
        // Smart default: full-width for database pages or pages with covers
        const isDatabasePage = page.parent?.type === 'database_id'
        const hasCover = !!page.cover
        compatPageBlock.format.page_full_width = isDatabasePage || hasCover
      }

      // Apply page font (not available in official API, so use provided value or default)
      if (pageFont) {
        compatPageBlock.format.page_font = pageFont
      }

      // Apply small text setting (not available in official API, so use provided value or default)
      if (smallText !== undefined) {
        compatPageBlock.format.page_small_text = smallText
      }
    }

    return compatPageBlock
  }

  return null
}
