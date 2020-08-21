import * as types from 'notion-types'

/**
 * Gets the IDs of all blocks contained on a page starting from a root block ID.
 */
export const getPageContentBlockIds = (
  recordMap: types.ExtendedRecordMap,
  blockId?: string
): string[] => {
  const rootBlockId = blockId || Object.keys(recordMap.block)[0]
  const contentBlockIds = new Set<string>()

  function addContentBlocks(blockId: string) {
    const block = recordMap.block[blockId]?.value
    if (!block) return

    contentBlockIds.add(blockId)

    const { content, type } = block
    if (!content) return

    if (type === 'page' && blockId !== rootBlockId) {
      // ignore subpages
      return
    }

    for (const blockId of content) {
      addContentBlocks(blockId)
    }
  }

  addContentBlocks(rootBlockId)
  return Array.from(contentBlockIds)
}
