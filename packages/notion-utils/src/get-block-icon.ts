import { Block, PageBlock, ExtendedRecordMap } from 'notion-types'

export function getBlockIcon(block: Block, recordMap: ExtendedRecordMap) {
  if ((block as PageBlock).format?.page_icon) {
    return (block as PageBlock).format?.page_icon
  }

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const collection = recordMap.collection[block.collection_id]?.value

    if (collection) {
      return collection.icon
    }
  }

  return null
}
