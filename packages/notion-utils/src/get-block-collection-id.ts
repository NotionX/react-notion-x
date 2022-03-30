import { Block } from 'notion-types'

export function getBlockCollectionId(block: Block): string | null {
  return (
    (block as any).collection_id ||
    (block as any).format?.collection_pointer?.id ||
    null
  )
}
