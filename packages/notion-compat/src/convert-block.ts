import * as notion from 'notion-types'
import * as types from './types'

import { convertTime } from './convert-time'
import { convertColor } from './convert-color'
import { convertRichText } from './convert-rich-text'

export function convertBlock({
  block: partialBlock,
  children = [],
  pageMap
}: {
  block: types.PartialBlock
  children?: string[]
  pageMap: types.PageMap
}): notion.Block {
  const compatBlock: Partial<notion.BaseBlock> = {
    id: partialBlock.id,
    content: children
  }

  const block = partialBlock as types.Block
  if (!block.type) {
    return compatBlock as notion.Block
  }

  compatBlock.properties = {}
  compatBlock.format = {}
  compatBlock.type = block.type
  compatBlock.created_time = convertTime(block.created_time)
  compatBlock.last_edited_time = convertTime(block.last_edited_time)
  compatBlock.created_by_table = block.created_by?.object
  compatBlock.created_by_id = block.created_by?.id
  compatBlock.last_edited_by_table = block.last_edited_by?.object
  compatBlock.last_edited_by_id = block.last_edited_by?.id
  compatBlock.alive = block.archived !== true

  const blockDetails = block[block.type]
  if (blockDetails) {
    if (blockDetails.rich_text) {
      compatBlock.properties.title = convertRichText(blockDetails.rich_text)
    }

    if (blockDetails.color) {
      compatBlock.format.block_color = convertColor(blockDetails.color)
    }
  }

  switch (block.type) {
    case 'paragraph':
      compatBlock.type = 'text'
      break

    case 'heading_1':
      compatBlock.type = 'header'
      break

    case 'heading_2':
      compatBlock.type = 'sub_header'
      break

    case 'heading_3':
      compatBlock.type = 'sub_sub_header'
      break

    case 'bulleted_list_item':
      compatBlock.type = 'bulleted_list'
      break

    case 'numbered_list_item':
      break

    case 'quote':
      break

    case 'to_do':
      break

    case 'toggle':
      break

    case 'template':
      break

    case 'synced_block':
      break

    case 'child_page': {
      compatBlock.type = 'page'

      const page = pageMap[block.id] as types.Page
      if (page) {
        if (page.properties.title) {
          compatBlock.properties.title = convertRichText(
            (page.properties.title as any).title
          )
        }

        if (page.cover) {
          switch (page.cover.type) {
            case 'external':
              compatBlock.format.page_cover = page.cover.external.url
              break

            case 'file':
              compatBlock.format.page_cover = page.cover.file.url
              break
          }

          // TODO
          compatBlock.format.page_cover_position = 0.5
        }

        if (page.icon) {
          switch (page.icon.type) {
            case 'emoji':
              compatBlock.format.page_icon = page.icon.emoji
              break

            case 'external':
              compatBlock.format.page_icon = page.icon.external.url
              break

            case 'file':
              compatBlock.format.page_icon = page.icon.file.url
              break
          }
        }

        if (page.parent) {
          switch (page.parent.type) {
            case 'workspace':
              compatBlock.parent_table = 'space'
              break

            case 'database_id':
              compatBlock.parent_table = 'table'
              break

            case 'page_id':
              compatBlock.parent_table = 'block'
              break
          }
        }

        // TODO: componentPageBlock.parent_id
      }

      if (block.child_page) {
        if (block.child_page.title) {
          compatBlock.properties.title = [[block.child_page.title]]
        }
      }

      break
    }

    case 'child_database':
      break

    case 'equation':
      break

    case 'code':
      break

    case 'callout':
      break

    case 'file':
      break

    case 'divider':
      break

    case 'breadcrumb':
      break

    case 'table_of_contents':
      break

    case 'column_list':
      break

    case 'column':
      break

    case 'link_to_page':
      break

    case 'table':
      break

    case 'table_row':
      break

    case 'embed':
      break

    case 'bookmark':
      break

    case 'image':
      break

    case 'video':
      break

    case 'pdf':
      break

    case 'audio':
      break

    case 'link_preview':
      break

    case 'unsupported':
      break
  }

  return compatBlock as notion.Block
}
