import { type ExtendedRecordMap } from 'notion-types'
import { defaultMapPageUrl, getAllPagesInSpace } from 'notion-utils'

import { NotionPage } from '../components/NotionPage'
import {
  isDev,
  previewImagesEnabled,
  rootDomain,
  rootNotionPageId,
  rootNotionSpaceId
} from '../lib/config'
import * as notion from '../lib/notion'

export const getStaticProps = async (context: any) => {
  if (!isDev) {
    return { props: {}, revalidate: false }
  }

  const pageId = context.params.pageId as string
  const recordMap = await notion.getPage(pageId)

  // NOTE: this isn't necessary; trying to reduce my vercel bill
  // const blockIds = Object.keys(recordMap.block)
  // const firstBlock = blockIds.length > 0 ? recordMap.block[blockIds[0]!] : null
  // if (rootNotionSpaceId && firstBlock?.value?.space_id !== rootNotionSpaceId) {
  //   return {
  //     notFound: true
  //   }
  // }

  return {
    props: {
      recordMap
    },
    // cache for 1 week in seconds
    // NOTE: you'll likely want to use a shorter cache time for your app, but
    // I'm bumping this up because my vercel bill keeps increasing due to people
    // abusing the demo to host their own sites.
    revalidate: 604_800
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  const mapPageUrl = defaultMapPageUrl(rootNotionPageId)

  // This crawls all public pages starting from the given root page in order
  // for next.js to pre-generate all pages via static site generation (SSG).
  // This is a useful optimization but not necessary; you could just as easily
  // set paths to an empty array to not pre-generate any pages at build time.
  const pages = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage,
    {
      traverseCollections: false
    }
  )

  const paths = Object.keys(pages)
    .map((pageId) => mapPageUrl(pageId))
    .filter((path) => path && path !== '/')

  return {
    paths,
    // TODO: changing this to false because my vercel bill keeps increasing due to
    // people abusing the demo to host their own sites.
    fallback: false
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
