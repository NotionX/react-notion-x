import { type ExtendedRecordMap } from 'notion-types'

import { NotionPage } from '../components/NotionPage'
import {
  imageRegressionRecordMap,
  imageRegressionRootId
} from '../lib/image-regression'

export const getStaticProps = async () => ({
  props: {
    recordMap: imageRegressionRecordMap
  },
  revalidate: 604_800
})

export default function ImageRegressionPage({
  recordMap
}: {
  recordMap: ExtendedRecordMap
}) {
  return <NotionPage recordMap={recordMap} rootPageId={imageRegressionRootId} />
}
