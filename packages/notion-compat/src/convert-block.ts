import * as notion from 'notion-types'
import * as types from './types'

import { convertTime } from './convert-time'
import { convertColor } from './convert-color'
import { convertRichText } from './convert-rich-text'

export function convertBlock({
  block: partialBlock,
  children = [],
  pageMap,
  blockMap,
  parentMap
}: {
  block: types.PartialBlock
  children?: string[]
  pageMap?: types.PageMap
  blockMap?: types.BlockMap
  parentMap?: types.ParentMap
}): notion.Block {
  const compatBlock: Partial<notion.BaseBlock> = {
    id: partialBlock.id
  }

  if (children && children.length) {
    compatBlock.content = children
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
  if (block.created_by) {
    compatBlock.created_by_table = `notion_${block.created_by.object}`
    compatBlock.created_by_id = block.created_by.id
  }
  compatBlock.last_edited_by_table = block.last_edited_by?.object
  compatBlock.last_edited_by_id = block.last_edited_by?.id
  compatBlock.alive = block.archived !== true

  if (parentMap) {
    const parentId = parentMap[block.id]

    if (parentId) {
      compatBlock.parent_id = parentId

      const parentBlock = blockMap?.[parentId] as types.Block
      if (parentBlock) {
        switch (parentBlock.type) {
          case 'child_database':
            compatBlock.parent_table = 'table'
            break

          case 'child_page':
          // fallthrough
          default:
            compatBlock.parent_table = 'block'
            break
        }
      } else {
        const parentPage = pageMap?.[parentId] as types.Page

        if (parentPage) {
          compatBlock.parent_table = 'block'
        }
      }
    }
  }

  const blockDetails = block[block.type]
  if (blockDetails) {
    if (blockDetails.rich_text) {
      compatBlock.properties.title = convertRichText(blockDetails.rich_text)
    }

    if (blockDetails.color) {
      compatBlock.format.block_color = convertColor(blockDetails.color)
    }

    if (blockDetails.icon) {
      switch (blockDetails.icon.type) {
        case 'emoji':
          compatBlock.format.page_icon = blockDetails.icon.emoji
          break

        case 'external':
          compatBlock.format.page_icon = blockDetails.icon.external.url
          break

        case 'file':
          compatBlock.format.page_icon = blockDetails.icon.file.url
          break
      }
    }

    if (blockDetails.type) {
      switch (blockDetails.type) {
        case 'external':
          compatBlock.properties.source = [[blockDetails.external.url]]
          break

        case 'file':
          compatBlock.properties.source = [[blockDetails.file.url]]
          break
      }
    }
  }

  switch (block.type) {
    case 'paragraph':
      compatBlock.type = 'text'
      if (!block.paragraph?.rich_text?.length) {
        delete compatBlock.properties
      }
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
      compatBlock.type = 'numbered_list'
      break

    case 'quote':
      break

    case 'to_do':
      if (block.to_do?.checked) {
        compatBlock.properties.checked = [['Yes']]
      }
      break

    case 'toggle':
      break

    case 'template':
      // TODO
      break

    case 'synced_block':
      // TODO
      break

    case 'child_page': {
      compatBlock.type = 'page'

      if (pageMap) {
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
        }
      }

      if (block.child_page) {
        if (block.child_page.title) {
          compatBlock.properties.title = [[block.child_page.title]]
        }
      }

      break
    }

    case 'child_database':
      // TODO
      break

    case 'equation':
      // TODO
      break

    case 'code':
      if (block.code.language) {
        compatBlock.properties.language = [[block.code.language]]
      }
      break

    case 'callout':
      break

    case 'file':
      // TODO
      break

    case 'divider':
      break

    case 'breadcrumb':
      // TODO
      break

    case 'table_of_contents':
      break

    case 'column_list':
      break

    case 'column':
      break

    case 'link_to_page':
      compatBlock.type = 'alias'
      switch (block.link_to_page?.type) {
        case 'page_id':
          compatBlock.format.alias_pointer = {
            id: block.link_to_page.page_id,
            table: 'block'
          }
          break

        case 'database_id':
          compatBlock.format.alias_pointer = {
            id: block.link_to_page.database_id,
            table: 'table'
          }
          break
      }
      break

    case 'table':
      // TODO
      break

    case 'table_row':
      // TODO
      break

    case 'embed':
      // TODO
      break

    case 'bookmark':
      if (block.bookmark.url) {
        compatBlock.properties.link = [[block.bookmark.url]]
      }

      if (block.bookmark.caption) {
        compatBlock.properties.description = convertRichText(
          block.bookmark.caption
        )
      }
      break

    case 'image':
      // TODO
      break

    case 'video':
      // TODO: formatting
      compatBlock.format.block_page_width = true
      compatBlock.format.block_aspect_ratio = 0.5620608899297423
      break

    case 'pdf':
      compatBlock.format.block_page_width = true
      compatBlock.format.block_height = '80vh'
      break

    case 'audio':
      // TODO
      break

    case 'link_preview':
      // TODO
      break

    case 'unsupported':
      break
  }

  return compatBlock as notion.Block
}
