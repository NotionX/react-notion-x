import * as types from 'notion-types'

/**
 * Returns the parent page block containing a given page.
 *
 * Note that many times this will not be the direct parent block since
 * some non-page content blocks can contain sub-blocks.
 */
export const getBlockParentPage = (
  block: types.Block,
  recordMap: types.ExtendedRecordMap
): types.PageBlock | null => {
  let currentRecord: types.Block | types.Collection = block

  while (currentRecord != null) {
    const parentId: string = currentRecord.parent_id
    const parentTable = currentRecord.parent_table

    if (parentTable === 'collection') {
      currentRecord = recordMap.collection[parentId]?.value
    } else {
      currentRecord = recordMap.block[parentId]?.value

      if ((currentRecord as types.Block)?.type === 'page') {
        return currentRecord as types.PageBlock
      }
    }
  }

  return null
}
