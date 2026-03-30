import type {
  Block,
  Decoration,
  ExtendedRecordMap,
  TableRowBlock
} from 'notion-types'
import {
  defaultMapImageUrl,
  getBlockCollectionId,
  getBlockTitle,
  getBlockValue,
  getListNestingLevel,
  getListNumber,
  getTextContent,
  uuidToId
} from 'notion-utils'
import pMap from 'p-map'
import { getTweet, tweetToMarkdown } from 'tweet-to-md'

import { getIcon } from './icon'
import { renderCollectionProperty } from './property'
import { decorationsToMarkdown } from './text'

export async function renderBlock(
  blockId: string,
  recordMap: ExtendedRecordMap,
  level = 0
): Promise<string> {
  const rawBlock = recordMap.block[blockId]
  if (!rawBlock) return ''

  const block = getBlockValue(rawBlock)
  if (!block) return ''

  const { type } = block

  switch (type) {
    case 'page':
      if (level === 0) {
        const title = getTitle(block, recordMap)
        const children = await renderBlockChildren(block, recordMap, level + 1)
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

    case 'header_4':
      return `#### ${getTitle(block, recordMap)}\n`

    case 'text': {
      const content = getTitle(block, recordMap)
      const children = await renderBlockChildren(block, recordMap, level + 1)
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
        const children = await renderBlockChildren(block, recordMap, level + 1)
        return `${content}\n${children}`
      }
      return content
    }

    case 'numbered_list': {
      const listNestingLevel = getListNestingLevel(block.id, recordMap.block)
      const listNumber = getListNumber(block.id, recordMap.block)
      const indent = '   '.repeat(listNestingLevel)
      const content = `${indent}${listNumber}. ${getTitle(block, recordMap)}`
      if (block.content?.length) {
        const children = await renderBlockChildren(block, recordMap, level + 1)
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
      const children = await renderBlockChildren(block, recordMap, level + 1)
      const parts = [content, children].filter(Boolean)
      return parts.map((part) => prefixLines(part, '> ')).join('\n')
    }

    case 'callout': {
      const content = getTitle(block, recordMap)
      const children = await renderBlockChildren(block, recordMap, level + 1)
      const title = [getIcon(block, recordMap), content]
        .filter(Boolean)
        .join(' ')

      const parts = [title, children].filter(Boolean)
      return parts.map((part) => prefixLines(part, '> ')).join('\n')
    }

    case 'toggle': {
      const content = getTitle(block, recordMap)
      const children = await renderBlockChildren(block, recordMap, level + 1)
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

    case 'tweet': {
      const src: string | undefined =
        recordMap.signed_urls?.[block.id] || block.properties?.source?.[0]?.[0]
      const id = src?.split('?')?.[0]?.split('/').pop()
      if (!id) return ''
      try {
        const tweet = await getTweet(id)
        if (!tweet) return ''
        return tweetToMarkdown(tweet)
      } catch {
        return ''
      }
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
      return renderBlockChildren(block, recordMap, level + 1)

    case 'transclusion_reference': {
      const syncBlock = block
      const targetId =
        syncBlock.format?.copied_from_pointer?.id ??
        syncBlock?.format?.transclusion_reference_pointer?.id
      if (!targetId) return ''
      const targetBlock = getBlockValue(recordMap.block[targetId])
      if (!targetBlock?.content?.length) return ''
      return renderBlockChildren(targetBlock, recordMap, level)
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
    case 'collection_view_page': {
      const collectionId = getBlockCollectionId(block, recordMap)
      if (!collectionId) return ''

      const collection = getBlockValue(recordMap.collection?.[collectionId])
      if (!collection) return ''

      const viewId = (block as any).view_ids?.[0]
      if (!viewId) return ''

      const collectionView = getBlockValue(recordMap.collection_view?.[viewId])
      const collectionData =
        recordMap.collection_query?.[collectionId]?.[viewId]
      if (!collectionData) return ''

      const blockIds: string[] =
        collectionData.collection_group_results?.blockIds ??
        collectionData.blockIds ??
        []

      if (blockIds.length === 0) return ''

      let properties: Array<{ property: string }>
      if (collectionView?.format?.table_properties) {
        properties = (collectionView.format.table_properties as any[]).filter(
          (p: any) => p.visible && collection.schema[p.property]
        )
      } else {
        properties = [{ property: 'title' }].concat(
          Object.keys(collection.schema)
            .filter((p) => p !== 'title')
            .map((property) => ({ property }))
        )
      }

      if (properties.length === 0) return ''

      const headerCells = properties.map((p) => {
        if (p.property === 'title') {
          return collection.schema.title?.name ?? 'Name'
        }
        return collection.schema[p.property]?.name ?? p.property
      })

      const rows = blockIds
        .map((rowId) => {
          const rowBlock = getBlockValue(recordMap.block[rowId])
          if (!rowBlock) return null
          return properties.map((p) => {
            const schema = collection.schema[p.property]
            if (!schema) return ''
            const cellDecs: Decoration[] =
              (rowBlock as any).properties?.[p.property] ?? []
            return renderCollectionProperty(
              schema,
              cellDecs,
              rowBlock,
              recordMap,
              collection
            )
          })
        })
        .filter((r): r is string[] => r !== null)

      if (rows.length === 0) return ''

      const collectionTitle = getTextContent(collection.name).trim()
      const heading = collectionTitle ? `### ${collectionTitle}\n\n` : ''

      const formatRow = (cols: string[]) => `| ${cols.join(' | ')} |`
      const separator = `| ${properties.map(() => '---').join(' | ')} |`

      const table = [
        formatRow(headerCells),
        separator,
        ...rows.map(formatRow)
      ].join('\n')

      return `${heading}${table}`
    }

    default:
      return ''
  }
}

async function renderBlockChildren(
  block: Block,
  recordMap: ExtendedRecordMap,
  level: number
): Promise<string> {
  if (!block.content?.length) return ''
  return (
    await pMap(
      block.content,
      async (childId) => renderBlock(childId, recordMap, level),
      { concurrency: 4 }
    )
  )
    .filter(Boolean)
    .join('\n')
}

function getTitle(block: Block, recordMap: ExtendedRecordMap): string {
  return decorationsToMarkdown(block.properties?.title ?? [], recordMap)
}

function prefixLines(text: string, prefix: string): string {
  return text
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n')
}
