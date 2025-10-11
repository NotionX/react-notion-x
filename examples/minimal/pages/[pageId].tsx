import { type ExtendedRecordMap } from 'notion-types'

import { NotionPage } from '../components/NotionPage'
import { rootNotionPageId } from '../lib/config'
import notion from '../lib/notion'

export const getStaticProps = async (context: any) => {
  const pageId = (context.params.pageId as string) || rootNotionPageId
  const recordMap = await notion.getPage(pageId)

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
  return {
    paths: [],
    // TODO: changing this to false because my vercel bill keeps increasing due to
    // people abusing the demo to host their own sites.
    fallback: false
  }
}

export default function Page({ recordMap }: { recordMap: ExtendedRecordMap }) {
  return <NotionPage recordMap={recordMap} rootPageId={rootNotionPageId} />
}
