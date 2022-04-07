import { ExtendedRecordMap } from 'notion-types'

export function mergeRecordMaps(
  recordMapA: ExtendedRecordMap,
  recordMapB: ExtendedRecordMap
): ExtendedRecordMap {
  const mergedRecordMap: ExtendedRecordMap = {
    block: {
      ...recordMapA.block,
      ...recordMapB.block
    },
    collection: {
      ...recordMapA.collection,
      ...recordMapB.collection
    },
    collection_view: {
      ...recordMapA.collection_view,
      ...recordMapB.collection_view
    },
    notion_user: {
      ...recordMapA.notion_user,
      ...recordMapB.notion_user
    },
    collection_query: {
      ...recordMapA.collection_query,
      ...recordMapB.collection_query
    },
    signed_urls: {
      ...recordMapA.signed_urls,
      ...recordMapB.signed_urls
    },
    preview_images: {
      ...recordMapA.preview_images,
      ...recordMapB.preview_images
    }
  }

  return mergedRecordMap
}
