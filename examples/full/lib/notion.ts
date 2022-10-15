import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { NotionCompatAPI } from 'notion-compat'
import { ExtendedRecordMap, SearchParams, SearchResults } from 'notion-types'

import { previewImagesEnabled, useOfficialNotionAPI } from './config'
import { getPreviewImageMap } from './preview-images'

const notion = useOfficialNotionAPI
  ? new NotionCompatAPI(new Client({ auth: process.env.NOTION_TOKEN }))
  : new NotionAPI()

if (useOfficialNotionAPI) {
  console.warn(
    'Using the official Notion API. Note that many blocks only include partial support for formatting and layout. Use at your own risk.'
  )
}

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId)

  if (previewImagesEnabled) {
    const previewImageMap = await getPreviewImageMap(recordMap)
    ;(recordMap as any).preview_images = previewImageMap
  }

  return recordMap
}

export async function search(params: SearchParams): Promise<SearchResults> {
  return notion.search(params)
}
