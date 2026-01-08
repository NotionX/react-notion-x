import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { NotionCompatAPI } from 'notion-compat'
import {
  type ExtendedRecordMap,
  type SearchParams,
  type SearchResults
} from 'notion-types'

import { previewImagesEnabled, useOfficialNotionAPI } from './config'
import { getPreviewImageMap } from './preview-images'

const notion = useOfficialNotionAPI
  ? new NotionCompatAPI(new Client({ auth: process.env.NOTION_TOKEN }))
  : new NotionAPI({
      activeUser: 'a8ee6b11-07a9-4d0a-993f-c4c4590e42ff',
      authToken:
        'v03:eyJhbGciOiJkaXIiLCJraWQiOiJwcm9kdWN0aW9uOnRva2VuLXYzOjIwMjQtMTEtMDciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIn0..Tpz9B-H14wetrcBe8aqe0w.08mjzgfaS3Ai_jrBQyWSrcURogYRASd0wkXIhcD1GGi8v8stHxAUfz7jHqmgBMKav0g_-u8MeMzCnHWVeNKBaK806bIhyFhuPCxAhqofM0PBr9Fgm35MtKNLqOgJCSaWiKMmaWBQF_UP1bX8a8068k0-Kde12BQsRjJW1ro2DEsfVzVI_nQdK1rD86KyGCTiYfUV8C1-fylHrOnghgor2lX9f0HXDX0Ueja_h4rWahshYdy7mt2NdR1SRpfG0H5riO-59TmYezgtaX-epxNVNjfRqF_Bfa8XtAFTj70K2_wwbGMY4CDQ0ZrCf9gugTRR_Bu1mcQU1NQTqHI-uVSHVUzdHmaJ5hnmRF2wbT0Qg-M.1hHExpfzVDDtG5BaQWORO7Hd8Lwz6xOcrL8p73qynv0'
    })

if (useOfficialNotionAPI) {
  console.log('Using official Notion API', process.env.NOTION_TOKEN)
  console.warn(
    'Using the official Notion API. Note that many blocks only include partial support for formatting and layout. Use at your own risk.'
  )
}

export async function getPage(pageId: string): Promise<ExtendedRecordMap> {
  const recordMap = await notion.getPage(pageId, { fetchRelationPages: true })

  if (previewImagesEnabled) {
    const previewImageMap = await getPreviewImageMap(recordMap)
    ;(recordMap as any).preview_images = previewImageMap
  }

  return recordMap
}

export async function search(params: SearchParams): Promise<SearchResults> {
  if ('search' in notion) {
    return notion.search(params)
  } else {
    throw new Error('Notion API does not support search')
  }
}
