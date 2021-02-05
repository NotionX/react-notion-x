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
    if (contentBlockIds.has(blockId)) return
    contentBlockIds.add(blockId)

    const block = recordMap.block[blockId]?.value
    if (!block) return

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

  for (const blockId of Object.keys(recordMap.block)) {
    const block = recordMap.block[blockId]?.value
    if (!block) continue

    const { properties } = block

    if (properties) {
      // TODO: this needs some love, especially for resolving relation properties
      // see this collection_view_page for an example: 8a586d253f984b85b48254da84465d23
      for (const key of Object.keys(properties)) {
        const p = properties[key]
        p.map((d: any) => {
          const value = d?.[0]?.[1]?.[0]
          if (value?.[0] === 'p' && value[1]) {
            contentBlockIds.add(value[1])
          }
        })

        // [["‣", [["p", "841918aa-f2a3-4d4c-b5ad-64b0f57c47b8"]]]]
        const value = p?.[0]?.[1]?.[0]

        if (value?.[0] === 'p' && value[1]) {
          contentBlockIds.add(value[1])
        }
      }
    }
  }

  return Array.from(contentBlockIds)
}
