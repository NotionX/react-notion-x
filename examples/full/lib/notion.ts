import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'

import { getPreviewImageMap } from './preview-images'
import { getTweetAstMap } from './tweet-embeds'
import { previewImagesEnabled, tweetEmbedsEnabled } from './config'

export const notion = new NotionAPI()

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId)

  if (previewImagesEnabled) {
    const previewImageMap = await getPreviewImageMap(recordMap)
    ;(recordMap as any).preview_images = previewImageMap
  }

  if (tweetEmbedsEnabled) {
    const tweetAstMap = await getTweetAstMap(recordMap)
    ;(recordMap as any).tweetAstMap = tweetAstMap
  }

  return recordMap
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}
