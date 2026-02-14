import { type Block, type ExtendedRecordMap } from 'notion-types'

import { getBlockCollectionId } from './get-block-collection-id'
import { getBlockValue } from './get-block-value'
import { getTextContent } from './get-text-content'

export function getBlockTitle(block: Block, recordMap: ExtendedRecordMap) {
  if (block.properties?.title) {
    return getTextContent(block.properties.title)
  }

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const collectionId = getBlockCollectionId(block, recordMap)

    if (collectionId) {
      const collection = getBlockValue(recordMap.collection[collectionId])

      if (collection) {
        return getTextContent(collection.name)
      }
    }
  }

  return ''
}
