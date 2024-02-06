import * as types from 'notion-types'

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
 * Recursive function to traverse blocks and build the table of contents.
 */
const traverseBlocks = (
  blockIds: string[],
  recordMap: types.ExtendedRecordMap,
  indentLevel: number
): Array<TableOfContentsEntry> => {
  const toc: Array<TableOfContentsEntry> = []

  for (const blockId of blockIds) {
    const block = recordMap.block[blockId]?.value

    if (block) {
      const { type } = block

      if (
        type === 'header' ||
        type === 'sub_header' ||
        type === 'sub_sub_header'
      ) {
        toc.push({
          id: blockId,
          type,
          text: getTextContent(block.properties?.title),
          indentLevel: indentLevels[type]
        })
      }

      // If the block has content, recursively traverse it
      if (block.content) {
        const nestedHeaders = traverseBlocks(
          block.content,
          recordMap,
          indentLevel + 1
        )
        toc.push(...nestedHeaders)
      }
    }
  }

  return toc
}

/**
 * Gets the metadata for a table of contents block by parsing the page's
 * H1, H2, and H3 elements.
 */
export const getPageTableOfContents = (
  page: types.PageBlock,
  recordMap: types.ExtendedRecordMap
): Array<TableOfContentsEntry> => {
  const toc = traverseBlocks(page.content ?? [], recordMap, 0)

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
      const prevIndent = indentLevelStack[indentLevelStack.length - 1]
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

      // eslint-disable-next-line no-constant-condition
    } while (true)
  }

  return toc
}
