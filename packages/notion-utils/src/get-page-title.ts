import { type ExtendedRecordMap } from 'notion-types'

import { getBlockTitle } from './get-block-title'

export function getPageTitle(recordMap: ExtendedRecordMap) {
  const rootBlockId = Object.keys(recordMap.block)[0]
  if (!rootBlockId) return null

  const pageBlock = recordMap.block[rootBlockId]?.value

  if (pageBlock) {
    return getBlockTitle(pageBlock, recordMap)
  }

  return null
}
