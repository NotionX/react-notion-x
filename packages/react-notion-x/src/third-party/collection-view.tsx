import React from 'react'

import { useNotionContext } from '../context'
import { type CollectionViewProps } from '../types'
import { CollectionViewBoard } from './collection-view-board'
import { CollectionViewGallery } from './collection-view-gallery'
import { CollectionViewList } from './collection-view-list'
import { CollectionViewTable } from './collection-view-table'

export function CollectionViewImpl(props: CollectionViewProps) {
  const { collectionView } = props
  const { components } = useNotionContext()

  switch (collectionView.type) {
    case 'table':
      if (components.CollectionViewTable) {
        return <components.CollectionViewTable {...props} />
      }
      return <CollectionViewTable {...props} />

    case 'gallery':
      if (components.CollectionViewGallery) {
        return <components.CollectionViewGallery {...props} />
      }
      return <CollectionViewGallery {...props} />

    case 'list':
      if (components.CollectionViewList) {
        return <components.CollectionViewList {...props} />
      }
      return <CollectionViewList {...props} />

    case 'board':
      if (components.CollectionViewBoard) {
        return <components.CollectionViewBoard {...props} />
      }
      return <CollectionViewBoard {...props} />

    default:
      console.warn('unsupported collection view', collectionView)
      return null
  }
}

export const CollectionView = React.memo(CollectionViewImpl)
