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
      // no-op
      break

    case 'to_do':
      if (block.to_do?.checked) {
        compatBlock.properties.checked = [['Yes']]
      }
      break

    case 'toggle':
      // no-op
      break

    case 'code':
      if (block.code.language) {
        compatBlock.properties.language = [[block.code.language]]
      }
      break

    case 'callout':
      // no-op
      break

    case 'file':
      // no-op
      break

    case 'divider':
      // no-op
      break

    case 'breadcrumb':
      // TODO
      break

    case 'table_of_contents':
      // no-op
      break

    case 'column_list':
      // no-op
      break

    case 'column':
      // no-op
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

    case 'template':
      // TODO
      break

    case 'synced_block':
      if (block.synced_block.synced_from) {
        // TODO: handle block.synced_block.synced_from.type for non-block types
        compatBlock.type = 'transclusion_reference'
        compatBlock.format.transclusion_reference_pointer = {
          id: block.synced_block.synced_from.block_id,
          table: 'block'
        }
      } else {
        compatBlock.type = 'transclusion_container'
      }
      break

    case 'equation':
      if (block.equation?.expression) {
        compatBlock.properties.title = [[block.equation.expression]]
      }
      break

    case 'child_database':
      // TODO
      break

    case 'table':
      // TODO
      break

    case 'table_row':
      // TODO
      break

    case 'pdf':
      // TODO: formatting
      compatBlock.format.block_page_width = true
      compatBlock.format.block_height = '80vh'
      break

    case 'video': {
      // TODO: formatting
      compatBlock.format.block_page_width = true
      compatBlock.format.block_aspect_ratio = 0.5620608899297423

      try {
        const url = compatBlock.properties.source?.[0]?.[0]

        if (!url) break
        const u = new URL(url)

        switch (u.hostname) {
          case 'loom.com':
          case 'www.loom.com':
            u.pathname = u.pathname.replace(/^\/share\//i, '/embed/')
            compatBlock.format.display_source = u.toString()
            break
        }
      } catch {
        // ignore invalid urls
      }
      break
    }

    case 'embed': {
      // TODO: embedding really needs to use some sort of externaly embed API like
      // embedly or microlinkhq. Currently, many embed use cases will not work or
      // display properly.
      const url = block.embed?.url

      // TODO: formatting
      compatBlock.format.block_page_width = true
      compatBlock.format.block_height = '30vh'

      if (url) {
        compatBlock.properties.source = [[url]]

        try {
          const u = new URL(url)

          switch (u.hostname) {
            case 'twitter.com':
              compatBlock.type = 'tweet'
              delete compatBlock.format
              break

            case 'maps.google.com':
              compatBlock.type = 'maps'
              break

            case 'excalidraw.com':
              compatBlock.type = 'excalidraw'
              break

            case 'codepen.io':
              compatBlock.type = 'codepen'
              break

            case 'docs.google.com':
            // fallthrough
            case 'drive.google.com':
              compatBlock.type = 'drive'

              // TODO: fetch drive_properties
              break

            case 'figma.com':
              compatBlock.type = 'figma'
              break

            case 'open.spotify.com':
              if (
                u.pathname.includes('/embed/') ||
                u.pathname.includes('/embed-podcast/')
              ) {
                break
              }

              if (u.pathname.startsWith('/playlist/')) {
                u.pathname = `/embed${u.pathname}`
              } else if (u.pathname.startsWith('/episode/')) {
                u.pathname = `/embed-podcast${u.pathname}`
              }

              u.search = ''
              compatBlock.format.display_source = u.toString()
              break

            case 'airtable.com':
              if (!u.pathname.startsWith('/embed/')) {
                u.pathname = `/embed${u.pathname}`
                compatBlock.format.display_source = u.toString()
              }
              break

            case 'soundcloud.com':
              // TODO
              break
          }
        } catch {
          // ignore invalid urls
        }
      }
      break
    }

    case 'image':
      // no-op
      // TODO: handle formatting
      break

    case 'audio':
      // no-op
      break

    case 'link_preview':
      // TODO
      break

    case 'unsupported':
      // no-op
      break
  }

  return compatBlock as notion.Block
}
