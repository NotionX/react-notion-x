import type * as types from 'notion-types'

/**
 * Gets the IDs of all tweets embedded on a page.
 */
export const getPageTweets = (recordMap: types.ExtendedRecordMap): string[] => {
  const blockIds = Object.keys(recordMap.block)
  const tweetIds: string[] = blockIds
    .map((blockId) => {
      const block = recordMap.block[blockId]?.value

      if (block?.type === 'tweet') {
        const tweetId = block.properties?.source?.[0]?.[0]

        if (tweetId) {
          return tweetId
        }
      }
    })
    .filter(Boolean)

  return Array.from(new Set(tweetIds))
}
