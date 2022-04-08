import { Block, DateFormat, ExtendedRecordMap } from 'notion-types'
import { getTextContent } from './get-text-content'

/**
 * Gets the value of a collection property for a given page (collection item).
 *
 * @param propertyName property name
 * @param block Page block, often be first block in blockMap
 * @param recordMap
 * @returns - The return value types will follow the following principles:
 *  1. if property is date type, it will return `number` or `number[]`(depends on `End Date` switch)
 *  2. property is text-like will return `string`
 *  3. multi select property will return `string[]`
 *  4. checkbox property return `boolean`
 * @todo complete all no-text property type
 */
export function getPageProperty<
  T = string | number | boolean | string[] | number[]
>(propertyName: string, block: Block, recordMap: ExtendedRecordMap): T
export function getPageProperty(
  propertyName: string,
  block: Block,
  recordMap: ExtendedRecordMap
) {
  try {
    if (!block.properties || !Object.keys(recordMap.collection)) {
      // console.warn(
      //   `block ${block.id} has no properties or this recordMap has no collection record`
      // )
      return null
    }

    const collection = recordMap.collection[block.parent_id]?.value

    if (collection) {
      const propertyNameL = propertyName.toLowerCase()
      const propertyId = Object.keys(collection.schema).find(
        (key) => collection.schema[key]?.name?.toLowerCase() === propertyNameL
      )

      if (!propertyId) {
        return null
      }

      const { type } = collection.schema[propertyId]
      const content = getTextContent(block.properties[propertyId])

      switch (type) {
        case 'created_time':
          return block.created_time

        case 'multi_select':
          return content.split(',')

        case 'date': {
          const property = block.properties[propertyId] as [['‣', [DateFormat]]]
          const formatDate = property[0][1][0][1]

          if (formatDate.type == 'datetime') {
            return new Date(
              `${formatDate.start_date} ${formatDate.start_time}`
            ).getTime()
          } else if (formatDate.type == 'date') {
            return new Date(formatDate.start_date).getTime()
          } else if (formatDate.type == 'datetimerange') {
            const { start_date, start_time, end_date, end_time } = formatDate
            const startTime = new Date(`${start_date} ${start_time}`).getTime()
            const endTime = new Date(`${end_date} ${end_time}`).getTime()
            return [startTime, endTime]
          } else {
            const startTime = new Date(formatDate.start_date).getTime()
            const endTime = new Date(formatDate.end_date).getTime()
            return [startTime, endTime]
          }
        }

        case 'checkbox':
          return content == 'Yes'

        case 'last_edited_time':
          return block.last_edited_time

        default:
          return content
      }
    }
  } catch {
    // ensure that no matter what, we don't throw errors because of an unexpected
    // collection data format
  }

  return null
}
