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

    const { content, type, properties, format } = block
    if (properties) {
      // TODO: this needs some love, especially for resolving relation properties
      // see this collection_view_page for an example: 8a586d253f984b85b48254da84465d23
      for (const key of Object.keys(properties)) {
        const p = properties[key]
        p.map((d: any) => {
          const value = d?.[0]?.[1]?.[0]
          if (value?.[0] === 'p' && value[1]) {
            addContentBlocks(value[1])
          }
        })

        // [["‣", [["p", "841918aa-f2a3-4d4c-b5ad-64b0f57c47b8"]]]]
        const value = p?.[0]?.[1]?.[0]

        if (value?.[0] === 'p' && value[1]) {
          addContentBlocks(value[1])
        }
      }
    }

    if (format) {
      const referenceId = format.transclusion_reference_pointer?.id
      if (referenceId) {
        addContentBlocks(referenceId)
      }
    }

    if (!content || !Array.isArray(content)) {
      // no child content blocks to recurse on
      return
    }

    if (blockId !== rootBlockId) {
      if (type === 'page' || type === 'collection_view_page') {
        // ignore the content of other pages and collections
        return
      }
    }

    for (const blockId of content) {
      addContentBlocks(blockId)
    }
  }

  addContentBlocks(rootBlockId)
  return Array.from(contentBlockIds)
}
