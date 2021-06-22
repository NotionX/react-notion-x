import * as types from 'notion-types'

export type MapPageUrl = (pageId: string, recordMap?: types.ExtendedRecordMap | undefined) => string
export type MapImageUrl = (url: string, block: types.Block) => string
export type SearchNotion = (
  params: types.SearchParams
) => Promise<types.SearchResults>

export interface NotionComponents {
  // TODO: better typing for arbitrary react components
  link: any
  pageLink: any

  // blocks
  code: any
  equation: any

  // collection
  collection: any
  collectionRow: any

  // assets
  pdf: any
  tweet: any
  modal: any
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
