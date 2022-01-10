import * as types from 'notion-types'
import React from 'react'

export type MapPageUrl = (
  pageId: string,
  recordMap?: types.ExtendedRecordMap | undefined
) => string
export type MapImageUrl = (url: string, block: types.Block) => string
export type SearchNotion = (
  params: types.SearchParams
) => Promise<types.SearchResults>

export interface NotionComponents {
  // TODO: better typing for arbitrary react components
  image: any
  link: any
  pageLink: any
  checkbox: React.FC<{ isChecked: boolean; blockId: string }>

  // blocks
  code: any
  equation: any
  callout?: any

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
export interface CollectionGroupProps {
  collection: types.Collection
  collectionViewComponent: React.ElementType
  collectionGroup: any
  hidden: boolean
  schema: any
  value: any
  summaryProps: any
  detailsProps: any
}
