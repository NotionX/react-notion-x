import {
  type Block,
  type ExtendedRecordMap,
  type PageBlock
} from 'notion-types'

import { getBlockCollectionId } from './get-block-collection-id'
import { getBlockValue } from './get-block-value'

export function getBlockIcon(block: Block, recordMap: ExtendedRecordMap) {
  if ((block as PageBlock).format?.page_icon) {
    return (block as PageBlock).format?.page_icon
  }

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const collectionId = getBlockCollectionId(block, recordMap)
    if (collectionId) {
      const collection = getBlockValue(recordMap.collection[collectionId])

      if (collection) {
        return collection.icon
      }
    }
  }

  return null
}
