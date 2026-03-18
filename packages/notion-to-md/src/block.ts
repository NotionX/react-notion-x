import type { Block, ExtendedRecordMap, TableRowBlock } from 'notion-types'
import {
  defaultMapImageUrl,
  getBlockTitle,
  getBlockValue,
  getListNestingLevel,
  getListNumber,
  getTextContent,
  uuidToId
} from 'notion-utils'

import { getIcon } from './icon'
import { decorationsToMarkdown } from './text'

function getTitle(block: Block, recordMap: ExtendedRecordMap): string {
  return decorationsToMarkdown(block.properties?.title ?? [], recordMap)
}

function renderChildren(
  block: Block,
  recordMap: ExtendedRecordMap,
  level: number
): string {
  if (!block.content?.length) return ''
  return block.content
    .map((childId) => renderBlock(childId, recordMap, level + 1))
    .filter(Boolean)
    .join('\n')
}

function prefixLines(text: string, prefix: string): string {
  return text
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n')
}

export function renderBlock(
  blockId: string,
  recordMap: ExtendedRecordMap,
  level = 0
): string {
  const rawBlock = recordMap.block[blockId]
  if (!rawBlock) return ''

  const block = getBlockValue(rawBlock)
  if (!block) return ''

  const { type } = block

  switch (type) {
    case 'page':
      if (level === 0) {
        const title = getTitle(block, recordMap)
        const children = renderChildren(block, recordMap, level)
        return `# ${title}\n\n${children}\n`
      } else {
        const title = [
          getIcon(block, recordMap),
          getBlockTitle(block, recordMap)
        ]
          .filter(Boolean)
          .join(' ')
        return `[${title}](/${uuidToId(blockId)})\n`
      }

    case 'header':
      return `# ${getTitle(block, recordMap)}\n`

    case 'sub_header':
      return `## ${getTitle(block, recordMap)}\n`

    case 'sub_sub_header':
      return `### ${getTitle(block, recordMap)}\n`

    case 'text': {
      const content = getTitle(block, recordMap)
      const children = renderChildren(block, recordMap, level)
      if (!content && !children) return '\n'
      if (children) {
        return `${content}\n${prefixLines(children, '  ')}`
      }
      return `${content}\n`
    }

    case 'bulleted_list': {
      const listNestingLevel = getListNestingLevel(block.id, recordMap.block)
      const indent = '  '.repeat(listNestingLevel)
      const content = `${indent}- ${getTitle(block, recordMap)}`
      if (block.content?.length) {
        const children = block.content
          .map((id) => renderBlock(id, recordMap, level + 1))
          .filter(Boolean)
          .join('\n')
        return `${content}\n${children}`
      }
      return content
    }

    case 'numbered_list': {
      console.log('numbered_list', { level, block })
      const listNestingLevel = getListNestingLevel(block.id, recordMap.block)
      const listNumber = getListNumber(block.id, recordMap.block)
      const indent = '   '.repeat(listNestingLevel)
      const content = `${indent}${listNumber}. ${getTitle(block, recordMap)}`
      if (block.content?.length) {
        const children = block.content
          .map((id) => renderBlock(id, recordMap, level + 1))
          .filter(Boolean)
          .join('\n')
        return `${content}\n${children}`
      }
      return content
    }

    case 'to_do': {
      const checked = (block as any).properties?.checked?.[0]?.[0] === 'Yes'
      const checkbox = checked ? '- [x]' : '- [ ]'
      return `${checkbox} ${getTitle(block, recordMap)}`
    }

    case 'quote': {
      const content = getTitle(block, recordMap)
      const children = renderChildren(block, recordMap, level)
      const parts = [content, children].filter(Boolean)
      return parts.map((part) => prefixLines(part, '> ')).join('\n')
    }

    case 'callout': {
      const content = getTitle(block, recordMap)
      const children = renderChildren(block, recordMap, level)
      const title = [getIcon(block, recordMap), content]
        .filter(Boolean)
        .join(' ')

      const parts = [title, children].filter(Boolean)
      return parts.map((part) => prefixLines(part, '> ')).join('\n')
    }

    case 'toggle': {
      const content = getTitle(block, recordMap)
      const children = renderChildren(block, recordMap, level)
      return children
        ? `<details>\n<summary>${content}</summary>\n${children}\n</details>`
        : content
    }

    case 'code': {
      const lang = getTextContent((block as any).properties?.language) || ''
      const code = getTitle(block, recordMap)
      return `\`\`\`${lang}\n${code}\n\`\`\``
    }

    case 'divider':
      return '\n---\n'

    case 'image': {
      const source = (block as any).properties?.source?.[0]?.[0]
      const caption = (block as any).properties?.caption
        ? getTextContent((block as any).properties.caption)
        : ''
      const url = defaultMapImageUrl(source, block) || source || ''
      return `![${caption}](${url})`
    }

    case 'video': {
      const source = (block as any).properties?.source?.[0]?.[0] || ''
      return `[Video](${source})`
    }

    case 'audio': {
      const source = (block as any).properties?.source?.[0]?.[0] || ''
      return `[Audio](${source})`
    }

    case 'file': {
      const title = getTextContent((block as any).properties?.title)
      const source = (block as any).properties?.source?.[0]?.[0] || ''
      return `[${title || source}](${source})`
    }

    case 'pdf': {
      const source = (block as any).properties?.source?.[0]?.[0] || ''
      return `[PDF](${source})`
    }

    case 'embed': {
      const source = (block as any).properties?.source?.[0]?.[0] || ''
      const caption = (block as any).properties?.caption
      const title = caption ? getTextContent(caption) : source
      return `[${title}](${source})`
    }

    case 'gist': {
      const source = (block as any).properties?.source?.[0]?.[0] || ''
      return `[GitHub Gist](${source})`
    }

    case 'bookmark': {
      const url = getTextContent((block as any).properties?.link)
      const title = getTextContent((block as any).properties?.title) || url
      return `[${title}](${url})\n`
    }

    case 'button': {
      const url = getTextContent((block as any).properties?.link)
      const title = getTextContent((block as any).properties?.title) || url
      return `_${title}_\n`
    }

    case 'equation': {
      const formula = getTitle(block, recordMap)
      return `$$\n${formula}\n$$`
    }

    case 'table': {
      const tableBlock = block as any
      const columnOrder: string[] =
        tableBlock.format?.table_block_column_order ?? []
      const hasColumnHeader: boolean =
        tableBlock.format?.table_block_column_header ?? false
      const rowIds: string[] = block.content ?? []

      if (rowIds.length === 0 || columnOrder.length === 0) return ''

      const rows = rowIds
        .map((rowId) => {
          const rowRaw = recordMap.block[rowId]
          if (!rowRaw) return null
          const rowBlock = getBlockValue(rowRaw) as TableRowBlock | undefined
          if (!rowBlock) return null
          return columnOrder.map((colId) => {
            const cellDecs = (rowBlock as any).properties?.[colId] ?? []
            return decorationsToMarkdown(cellDecs, recordMap)
          })
        })
        .filter((r): r is string[] => r !== null)

      if (rows.length === 0) return ''

      let headerRow: string[]
      let dataRows: string[][]

      if (hasColumnHeader) {
        headerRow = rows[0]!
        dataRows = rows.slice(1)
      } else {
        headerRow = columnOrder.map(() => '')
        dataRows = rows
      }

      const formatRow = (cols: string[]) => `| ${cols.join(' | ')} |`
      const separator = `| ${columnOrder.map(() => '---').join(' | ')} |`

      return [formatRow(headerRow), separator, ...dataRows.map(formatRow)].join(
        '\n'
      )
    }

    case 'table_row':
      return '' // rendered by the parent table block

    case 'table_of_contents':
      return '' // skip

    case 'column_list':
    case 'column':
    case 'transclusion_container':
      return renderChildren(block, recordMap, level)

    case 'transclusion_reference': {
      const syncBlock = block
      const targetId =
        syncBlock.format?.copied_from_pointer?.id ??
        syncBlock?.format?.transclusion_reference_pointer?.id
      if (!targetId) return ''
      const targetBlock = getBlockValue(recordMap.block[targetId])
      if (!targetBlock?.content?.length) return ''
      return targetBlock.content
        .map((id: string) => renderBlock(id, recordMap, level))
        .filter(Boolean)
        .join('\n')
    }

    case 'alias': {
      const pageLink = block
      const targetId = pageLink.format?.alias_pointer?.id
      if (!targetId) return ''
      const targetBlock = getBlockValue(recordMap.block[targetId])
      const title = targetBlock?.properties?.title
        ? getTextContent(targetBlock.properties.title)
        : targetId
      const pageTitle = [getIcon(block, recordMap), title]
        .filter(Boolean)
        .join(' ')
      return `[${pageTitle}](/${uuidToId(targetId)})\n`
    }

    case 'collection_view':
    case 'collection_view_page':
      return '' // skip in first iteration

    default:
      return ''
  }
}
