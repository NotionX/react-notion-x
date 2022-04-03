import React from 'react'
import Head from 'next/head'

import { NotionRenderer } from 'react-notion-x'
import { ExtendedRecordMap } from 'notion-types'
import { getPageTitle } from 'notion-utils'

import dynamic from 'next/dynamic'
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)

export const NotionPage = ({
  recordMap,
  rootPageId
}: {
  recordMap: ExtendedRecordMap
  rootPageId?: string
}) => {
  if (!recordMap) {
    return null
  }

  const title = getPageTitle(recordMap)
  console.log(title, recordMap)

  return (
    <>
      <Head>
        <meta name='description' content='React Notion X Minimal Demo' />

        <title>{title}</title>
      </Head>

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        rootPageId={rootPageId}
        components={{
          Code
        }}
      />
    </>
  )
}
