import {
  CollectionViewBlock,
  CollectionViewPageBlock,
  ExtendedRecordMap
} from 'notion-types'

export function getBlockCollectionPointerId(
  recordMap: ExtendedRecordMap,
  block: CollectionViewBlock | CollectionViewPageBlock
): string | null {
  const collectionViewId = (block as any).view_ids[0]
  if (recordMap.collection_view[collectionViewId]) {
    const viewBlock = recordMap.collection_view[collectionViewId].value
    const collectionId = viewBlock.format?.collection_pointer?.id
    return collectionId
  }
  return null
}
