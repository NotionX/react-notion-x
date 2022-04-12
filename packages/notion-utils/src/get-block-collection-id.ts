import { Block, ExtendedRecordMap } from 'notion-types'

export function getBlockCollectionId(
  block: Block,
  recordMap: ExtendedRecordMap
): string | null {
  const collectionId =
    (block as any).collection_id ||
    (block as any).format?.collection_pointer?.id

  if (collectionId) {
    return collectionId
  }

  const collectionViewId = (block as any)?.view_ids?.[0]
  if (collectionViewId) {
    const collectionView = recordMap.collection_view?.[collectionViewId]?.value
    if (collectionView) {
      const collectionId = collectionView.format?.collection_pointer?.id
      return collectionId
    }
  }

  return null
}
