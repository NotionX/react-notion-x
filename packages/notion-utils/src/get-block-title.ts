import { Block, ExtendedRecordMap } from 'notion-types'
import { getTextContent } from './get-text-content'

export function getBlockTitle(block: Block, recordMap: ExtendedRecordMap) {
  if (block.properties?.title) {
    return getTextContent(block.properties.title)
  }

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const collection = recordMap.collection[block.collection_id]?.value

    if (collection) {
      return getTextContent(collection.name)
    }
  }

  return ''
}
