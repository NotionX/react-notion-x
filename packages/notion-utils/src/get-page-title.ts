import { type ExtendedRecordMap } from 'notion-types'

import { getBlockTitle } from './get-block-title'
import { getBlockValue } from './get-block-value'

export function getPageTitle(recordMap: ExtendedRecordMap) {
  const rootBlockId = Object.keys(recordMap.block)[0]
  if (!rootBlockId) return null

  const pageBlock = getBlockValue(recordMap.block[rootBlockId])

  if (pageBlock) {
    return getBlockTitle(pageBlock, recordMap)
  }

  return null
}
