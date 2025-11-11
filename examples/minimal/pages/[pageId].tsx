// import { type ExtendedRecordMap } from 'notion-types'

// import { NotionPage } from '../components/NotionPage'
// import { rootNotionPageId, rootNotionSpaceId } from '../lib/config'
// import notion from '../lib/notion'

// export const getStaticProps = async (context: any) => {
//   const pageId = (context.params.pageId as string) || rootNotionPageId
//   const recordMap = await notion.getPage(pageId)

// // NOTE: this isn't necessary; trying to reduce my vercel bill
// const blockIds = Object.keys(recordMap.block)
// const firstBlock = blockIds.length > 0 ? recordMap.block[blockIds[0]!] : null
// if (rootNotionSpaceId && firstBlock?.value?.space_id !== rootNotionSpaceId) {
//   return {
//     notFound: true
//   }
// }

//   return {
//     props: {
//       recordMap
//     },
//     // cache for 1 week in seconds
//     // NOTE: you'll likely want to use a shorter cache time for your app, but
//     // I'm bumping this up because my vercel bill keeps increasing due to people
//     // abusing the demo to host their own sites.
//     revalidate: 604_800
//   }
// }

// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: true
//   }
// }

// export default function Page({ recordMap }: { recordMap: ExtendedRecordMap }) {
//   return (
//     <div>
//       Hey 👋 I've disabled the public demo for react-notion-x for now because my
//       Vercel bill keeps increasing due to people abusing the demo.
//     </div>
//   )
// }

export const getStaticProps = async () => {
  return { props: {}, revalidate: false }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true
  }
}

export default function Page() {
  return (
    <div>
      Hey 👋 I've disabled the public demo for react-notion-x for now because my
      Vercel bill keeps increasing due to people abusing the demo.
    </div>
  )
}
