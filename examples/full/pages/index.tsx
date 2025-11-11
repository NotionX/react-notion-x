// import { type ExtendedRecordMap } from 'notion-types'

// import { NotionPage } from '../components/NotionPage'
// import {
//   previewImagesEnabled,
//   rootDomain,
//   rootNotionPageId
// } from '../lib/config'
// import * as notion from '../lib/notion'

// export const getStaticProps = async () => {
//   const pageId = rootNotionPageId
//   const recordMap = await notion.getPage(pageId)

//   return {
//     props: {
//       recordMap
//     },
//     revalidate: 86_400 // cache for 1 day in seconds
//   }
// }

// export default function Page({ recordMap }: { recordMap: ExtendedRecordMap }) {
//   return (
//     <NotionPage
//       recordMap={recordMap}
//       rootDomain={rootDomain}
//       rootPageId={rootNotionPageId}
//       previewImagesEnabled={previewImagesEnabled}
//     />
//   )
// }

export const getStaticProps = async () => {
  return { props: {}, revalidate: false }
}

export default function Page() {
  return (
    <div>
      Hey 👋 I've disabled the public demo for react-notion-x for now because my
      Vercel bill keeps increasing due to people abusing the demo.
    </div>
  )
}
