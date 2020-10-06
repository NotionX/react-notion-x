import React from 'react'

import { NotionAPI } from 'notion-client'
import { NotionRenderer } from 'react-notion-x'

const notion = new NotionAPI()

export const getStaticProps = async (context) => {
  const pageId = context.params.pageId as string
  const recordMap = await notion.getPage(pageId)

  return {
    props: {
      recordMap
    },
    revalidate: 10
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export default function NotionHomePage({ recordMap }) {
  if (!recordMap) {
    return null
  }

  console.log(recordMap)

  return (
    <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
  )
}
