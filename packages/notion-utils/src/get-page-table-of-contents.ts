import type * as types from 'notion-types'

import { getTextContent } from './get-text-content'

export interface TableOfContentsEntry {
  id: types.ID
  type: types.BlockType
  text: string
  indentLevel: number
}

const indentLevels = {
  header: 0,
  sub_header: 1,
  sub_sub_header: 2
}

/**
 * Gets the metadata for a table of contents block by parsing the page's
 * H1, H2, and H3 elements.
 */
export const getPageTableOfContents = (
  page: types.PageBlock,
  recordMap: types.ExtendedRecordMap
): Array<TableOfContentsEntry> => {
  type MapResult = TableOfContentsEntry | null | MapResult[]

  // Maps `content` property to TOC entries.
  // Pages and transclusion containers (synced blocks) both have the property.
  function mapContentToEntries(content?: string[]): MapResult[] {
    return (content ?? []).map((blockId: string) => {
      const block = recordMap.block[blockId]?.value

      if (block) {
        const { type } = block

        if (
          type === 'header' ||
          type === 'sub_header' ||
          type === 'sub_sub_header'
        ) {
          return {
            id: blockId,
            type,
            text: getTextContent(block.properties?.title),
            indentLevel: indentLevels[type]
          }
        }

        if (
          type === 'transclusion_container' ||
          type === 'column_list' ||
          type === 'column'
        ) {
          return mapContentToEntries(block.content)
        }
      }

      return null
    })
  }

  // Helper function to flatten nested results recursively
  function flattenResults(results: MapResult[]): TableOfContentsEntry[] {
    return results.flatMap((r) => {
      if (r == null) return []
      return Array.isArray(r) ? flattenResults(r) : [r]
    })
  }

  const toc = flattenResults(mapContentToEntries(page.content))

  const indentLevelStack = [
    {
      actual: -1,
      effective: -1
    }
  ]

  // Adjust indent levels to always change smoothly.
  // This is a little tricky, but the key is that when increasing indent levels,
  // they should never jump more than one at a time.
  for (const tocItem of toc) {
    const { indentLevel } = tocItem
    const actual = indentLevel

    do {
      const prevIndent = indentLevelStack.at(-1)!
      const { actual: prevActual, effective: prevEffective } = prevIndent

      if (actual > prevActual) {
        tocItem.indentLevel = prevEffective + 1
        indentLevelStack.push({
          actual,
          effective: tocItem.indentLevel
        })
      } else if (actual === prevActual) {
        tocItem.indentLevel = prevEffective
        break
      } else {
        indentLevelStack.pop()
      }
    } while (true)
  }

  return toc
}
