import React from 'react'

import { CollectionViewProps } from '../types'
import { CollectionViewTable } from './collection-view-table'
import { CollectionViewGallery } from './collection-view-gallery'
import { CollectionViewList } from './collection-view-list'
import { CollectionViewBoard } from './collection-view-board'

export const CollectionView: React.FC<CollectionViewProps> = (props) => {
  const { collectionView } = props

  switch (collectionView.type) {
    case 'table':
      return <CollectionViewTable {...props} />

    case 'gallery':
      return <CollectionViewGallery {...props} />

    case 'list':
      return <CollectionViewList {...props} />

    case 'board':
      return <CollectionViewBoard {...props} />

    default:
      console.warn('unsupported collection view', collectionView)
      return null
  }
}
