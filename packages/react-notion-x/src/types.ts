import * as types from 'notion-types'

export * from 'notion-types'

export type MapPageUrl = (pageId: string) => string
export type MapImageUrl = (url: string, block: types.Block) => string

export interface NotionComponents {
  // TODO: better typing for arbitrary react components
  link: any
  pageLink: any
}

export interface CollectionViewProps {
  collection: types.Collection
  collectionView: types.CollectionView
  collectionData: types.CollectionQueryResult
  padding: number
  width: number
}

export interface CollectionCardProps {
  collection: types.Collection
  block: types.PageBlock
  cover: types.CollectionCardCover
  coverSize: types.CollectionCardCoverSize
  coverAspect: types.CollectionCardCoverAspect
  properties?: Array<{
    property: types.PropertyID
    visible: boolean
  }>
  className?: string
}
