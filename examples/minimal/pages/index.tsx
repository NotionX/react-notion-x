import React from 'react'

import { Client } from '@notionhq/client'
import { NotionCompatAPI } from 'notion-compat'
import { ExtendedRecordMap } from 'notion-types'
// import { NotionAPI } from 'notion-client'

import { NotionPage } from '../components/NotionPage'
import { rootNotionPageId } from '../lib/config'

// const notion = new NotionAPI()
const notionCompat = new NotionCompatAPI(
  new Client({ auth: process.env.NOTION_TOKEN })
)

export const getStaticProps = async () => {
  const pageId = rootNotionPageId
  // const recordMap = await notion.getPage(pageId)
  const recordMap = await notionCompat.getPage(pageId)

  return {
    props: {
      recordMap
    },
    revalidate: 10
  }
}

export default function Page({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return <NotionPage recordMap={recordMap} rootPageId={rootNotionPageId} />
}
