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
        'v03:eyJhbGciOiJkaXIiLCJraWQiOiJwcm9kdWN0aW9uOnRva2VuLXYzOjIwMjQtMTEtMDciLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIn0..Z8R8gQ0tZ42obG2-oceTGg.Y8bi8Ubk5-7iWA1AJ3pzHyQCqfbXARQhbazmymm0QS-lEqw0fxV9XFsGUT-hv-QvUMN39olx9IuD6aLgND4A91iLMEVSjY8Mi3U0i9b0SsVGmte4FBNM759v1rSldOTN1hE-JOMX0He63EFai6gZ71aQiUY-o8U550LdbSxPqO5LILyG6tswka9Bu0EIeltZ2KzmVdhVJH8Xe4QJqqtljW8G4MDeuv-Wi72DC2ANf5A-xoP9gY_yFgEG3jOF_pyCkZQXzA6AfkyjCarY5w2qgZLBNFHHvLdUT5wOwbHaN7ng4xxLBCdkAzhr0mrib9_jLqYsjHEnmeyZbl8L_3zxCg.ABTGHFPJoigM5609UXMVBS25k58KUyz65dNz9n7qm7c'
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
