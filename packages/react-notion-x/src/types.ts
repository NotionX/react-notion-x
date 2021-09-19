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
  link: React.FC<JSX.IntrinsicElements['a']>
  pageLink: React.FC<JSX.IntrinsicElements['a']>
  checkbox: React.FC<{ blockId: string; isChecked: boolean }>

  // blocks
  code: React.FC<{
    language: string
    code: string
  }>
  equation: React.FC<{
    math: string
    block?: boolean
    className?: string
    settings: {
      throwOnError: boolean
      strict: boolean
    }
  }>

  // collection
  collection: React.FC<{
    block: types.CollectionViewPageBlock | types.CollectionViewBlock
    className?: string
  }>
  collectionRow: React.FC<{
    block: types.PageBlock
    className?: string
  }>

  // assets
  pdf: React.FC<{ file: string }>
  tweet: React.FC<{ id: string }>
  modal: React.FC<{
    isOpen: boolean
    contentLabel: string
    className?: string
    overlayClassName?: string
    onRequestClose: () => void
    onAfterOpen: () => void
  }>
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
