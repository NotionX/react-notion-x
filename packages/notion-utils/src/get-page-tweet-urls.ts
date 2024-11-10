import type * as types from 'notion-types'

/**
 * Gets the URLs of all tweets embedded on a page.
 */
export const getPageTweetUrls = (
  recordMap: types.ExtendedRecordMap
): string[] => {
  const blockIds = Object.keys(recordMap.block)
  const tweetUrls: string[] = blockIds
    .map((blockId) => {
      const block = recordMap.block[blockId]?.value

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
