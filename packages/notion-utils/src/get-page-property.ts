import { Block, ExtendedRecordMap } from 'notion-types'
import { getTextContent } from './get-text-content'

/**
 * Gets the value of a collection property for a given page (collection item).
 *
 * TODO: handle non-text property types.
 */
export function getPageProperty(
  propertyName: string,
  block: Block,
  recordMap: ExtendedRecordMap
): string | null {
  if (!block.properties) {
    // TODO: check parent page?
    return null
  }

  const collection = recordMap.collection[block.parent_id]?.value

  if (collection) {
    const propertyId = Object.keys(collection.schema).find(
      (key) => collection.schema[key]?.name === propertyName
    )

    if (propertyId) {
      return getTextContent(block.properties[propertyId])
    }
  }

  return null
}
