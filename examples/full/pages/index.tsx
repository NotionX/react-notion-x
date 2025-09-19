import { type ExtendedRecordMap } from 'notion-types'

import { NotionPage } from '../components/NotionPage'
import {
  previewImagesEnabled,
  rootDomain,
  rootNotionPageId
} from '../lib/config'
import * as notion from '../lib/notion'

export const getStaticProps = async () => {
  const pageId = rootNotionPageId
  const recordMap = await notion.getPage(pageId)

  return {
    props: {
      recordMap
    },
    revalidate: 86_400 // cache for 1 day in seconds
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
