import type * as types from 'notion-types'

import { getBlockValue } from './get-block-value'

/**
 * Returns the parent page block containing a given page.
 *
 * Note that many times this will not be the direct parent block since
 * some non-page content blocks can contain sub-blocks.
 */
export const getBlockParentPage = (
  block: types.Block,
  recordMap: types.ExtendedRecordMap,
  {
    inclusive = false
  }: {
    inclusive?: boolean
  } = {}
): types.PageBlock | null => {
  let currentRecord: types.Block | types.Collection | undefined = block

  while (currentRecord) {
    if (inclusive && (currentRecord as types.Block)?.type === 'page') {
      return currentRecord as types.PageBlock
    }

    const parentId: string = currentRecord.parent_id
    const parentTable = currentRecord.parent_table

    if (!parentId) {
      break
    }

    if (parentTable === 'collection') {
      currentRecord = getBlockValue(recordMap.collection[parentId])
    } else {
      currentRecord = getBlockValue(recordMap.block[parentId])

      if ((currentRecord as types.Block)?.type === 'page') {
        return currentRecord as types.PageBlock
      }
    }
  }

  return null
}
