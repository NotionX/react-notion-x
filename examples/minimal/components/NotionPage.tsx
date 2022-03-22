import React from 'react'
import Head from 'next/head'

import { getPageTitle } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'
import { ExtendedRecordMap } from 'notion-types'

export const NotionPage = ({
  recordMap,
  rootPageId,
  rootDomain
}: {
  recordMap: ExtendedRecordMap
  rootPageId?: string
  rootDomain?: string
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
        rootDomain={rootDomain}
        rootPageId={rootPageId}
      />
    </>
  )
}
