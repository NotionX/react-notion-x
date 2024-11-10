import type * as types from 'notion-types'

import { getPageTweetUrls } from './get-page-tweet-urls'

/**
 * Gets the IDs of all tweets embedded on a page.
 */
export const getPageTweetIds = (
  recordMap: types.ExtendedRecordMap
): string[] => {
  const tweetUrls = getPageTweetUrls(recordMap)
  return tweetUrls
    .map((url) => {
      try {
        const u = new URL(url)
        const parts = u.pathname.split('/')
        return parts.at(-1)
      } catch {
        return
      }
    })
    .filter(Boolean)
}
