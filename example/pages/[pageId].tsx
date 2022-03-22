import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'

import { NotionAPI } from 'notion-client'
import { getPageTitle, getAllPagesInSpace } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'

import { getPreviewImages } from '../lib/preview-images'
import { ExtendedRecordMap } from 'notion-types'

const Code = dynamic(() =>
  import('react-notion-x').then((notion) => notion.Code)
)

const Collection = dynamic(() =>
  import('react-notion-x').then((notion) => notion.Collection)
)

const CollectionRow = dynamic(
  () => import('react-notion-x').then((notion) => notion.CollectionRow),
  {
    ssr: false
  }
)

// NOTE: PDF support via "react-pdf" can sometimes cause errors depending on your
// build setup. If you're running into issues, just disable PDF support altogether.
const Pdf = dynamic(
  () => import('react-notion-x').then((notion) => notion.Pdf),
  { ssr: false }
)

const Equation = dynamic(() =>
  import('react-notion-x').then((notion) => notion.Equation)
)

const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
const notion = new NotionAPI()

const previewImagesEnabled = true

export const getStaticProps = async (context) => {
  const pageId = context.params.pageId as string
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

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const rootNotionPageId = '067dd719a912471ea9a3ac10710e7fdf'
  const rootNotionSpaceId = 'fde5ac74-eea3-4527-8f00-4482710e1af3'

  // This crawls all public pages starting from the given root page in order
  // for next.js to pre-generate all pages via static site generation (SSG).
  // This is a useful optimization but not necessary; you could just as easily
  // set paths to an empty array to not pre-generate any pages at build time.
  const pages = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage.bind(notion),
    {
      traverseCollections: false
    }
  )

  const paths = Object.keys(pages).map((pageId) => `/${pageId}`)

  return {
    paths,
    fallback: true
  }
}

export default function NotionPage({
  recordMap
}: {
  recordMap: ExtendedRecordMap
}) {
  if (!recordMap) {
    return null
  }

  const title = getPageTitle(recordMap)
  console.log(title, recordMap)

  const port = process.env.PORT || 3000
  const rootDomain = isDev ? `localhost:${port}` : null

  // useful for debugging from the dev console
  if (typeof window !== 'undefined') {
    const keys = Object.keys(recordMap?.block || {})
    const block = recordMap?.block?.[keys[0]]?.value
    const g = window as any
    g.recordMap = recordMap
    g.block = block
  }

  return (
    <>
      <Head>
        <meta name='description' content='React Notion X demo' />
        <title>{title}</title>
      </Head>

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        rootDomain={rootDomain}
        previewImages={previewImagesEnabled}
        components={{
          // remove this if you don't want to use next/image
          image: ({
            src,
            alt,

            width,
            height,

            className,
            style,

            ...rest
          }) => {
            const layout = width && height ? 'intrinsic' : 'fill'
            return (
              <Image
                {...rest}
                className={className}
                src={src}
                alt={alt}
                width={layout === 'intrinsic' && width}
                height={layout === 'intrinsic' && height}
                objectFit={style?.objectFit}
                objectPosition={style?.objectPosition}
                layout={layout}
              />
            )
          },
          code: Code,
          collection: Collection,
          collectionRow: CollectionRow,
          equation: Equation,
          pdf: Pdf
        }}
      />
    </>
  )
}
