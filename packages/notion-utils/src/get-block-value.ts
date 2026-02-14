import type {
  Block,
  Collection,
  CollectionView,
  NotionMapBox,
  User
} from 'notion-types'

// This helper unboxes a block value in a generic way which became necessary
// after Notion changed their API for some blocks to be doubly-nested.
// https://github.com/NotionX/react-notion-x/issues/682

export function getBlockValue<
  T extends Block | Collection | CollectionView | User
>(block: T | NotionMapBox<T> | undefined): T | undefined {
  if (!block) {
    return undefined
  }

  if ((block as any).value) {
    return getBlockValue((block as any).value)
  }

  if (!(block as any).id) {
    return undefined
  }

  return block as any as T
}
