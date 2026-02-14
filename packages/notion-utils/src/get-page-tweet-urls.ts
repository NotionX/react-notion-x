import type * as types from 'notion-types'

import { getBlockValue } from './get-block-value'

/**
 * Gets the URLs of all tweets embedded on a page.
 */
export const getPageTweetUrls = (
  recordMap: types.ExtendedRecordMap
): string[] => {
  const blockIds = Object.keys(recordMap.block)
  const tweetUrls: string[] = blockIds
    .map((blockId) => {
      const block = getBlockValue(recordMap.block[blockId])

      if (block?.type === 'tweet') {
        const tweetUrl = block.properties?.source?.[0]?.[0]

        if (tweetUrl) {
          return tweetUrl
        }
      }
    })
    .filter(Boolean)

  return Array.from(new Set(tweetUrls))
}
