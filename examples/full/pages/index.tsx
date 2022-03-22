import React from 'react'

import { NotionAPI } from 'notion-client'
import { ExtendedRecordMap } from 'notion-types'

import { getPreviewImages } from '../lib/preview-images'
import { NotionPage } from '../components/NotionPage'
import {
  rootNotionPageId,
  rootDomain,
  previewImagesEnabled
} from '../lib/config'

export const notion = new NotionAPI()

export const getStaticProps = async () => {
  const pageId = rootNotionPageId
  const recordMap = await notion.getPage(pageId)

  if (previewImagesEnabled) {
    await getPreviewImages(recordMap)
  }

  return {
    props: {
      recordMap
    },
    revalidate: 10
  }
}

export default function Page({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return (
    <NotionPage
      recordMap={recordMap}
      rootDomain={rootDomain}
      rootPageId={rootNotionPageId}
      previewImagesEnabled={previewImagesEnabled}
    />
  )
}
