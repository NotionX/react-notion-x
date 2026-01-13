import type * as notion from 'notion-types'

import type * as types from './types'
import { convertBlock } from './convert-block'

export function convertPage({
  pageId,
  blockMap,
  blockChildrenMap,
  pageMap,
  parentMap,
  fullWidth,
  pageFont,
  smallText
}: {
  pageId: string
  blockMap: types.BlockMap
  blockChildrenMap: types.BlockChildrenMap
  pageMap: types.PageMap
  parentMap: types.ParentMap
  fullWidth?: boolean
  pageFont?: 'default' | 'serif' | 'mono'
  smallText?: boolean
}): notion.ExtendedRecordMap {
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

  return {
    block: compatBlockMap as any,
    collection: {},
    collection_view: {},
    collection_query: {},
    signed_urls: {},
    notion_user: {}
  }
}

export function convertPageBlock({
  pageId,
  blockMap,
  blockChildrenMap,
  pageMap,
  parentMap,
  fullWidth,
  pageFont,
  smallText
}: {
  pageId: string
  blockMap: types.BlockMap
  blockChildrenMap: types.BlockChildrenMap
  pageMap: types.PageMap
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
