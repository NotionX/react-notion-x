import React from 'react'
import { PageBlock } from 'notion-types'

import { CollectionViewProps } from '../types'
import { cs } from '../utils'
import { useNotionContext } from '../context'
import { CollectionCard } from './collection-card'

export const CollectionViewGallery: React.FC<CollectionViewProps> = ({
  collection,
  collectionView,
  collectionData
}) => {
  const { recordMap } = useNotionContext()
  const {
    gallery_cover = { type: 'none' },
    gallery_cover_size = 'medium',
    gallery_cover_aspect = 'cover'
  } = collectionView.format || {}

  // console.log('gallery', { collection, collectionView, collectionData })

  return (
    <div className='notion-gallery'>
      <div className='notion-gallery-view'>
        <div
          className={cs(
            'notion-gallery-grid',
            `notion-gallery-grid-size-${gallery_cover_size}`
          )}
        >
          {collectionData.blockIds.map((blockId) => {
            const block = recordMap.block[blockId]?.value as PageBlock
            if (!block) return null

            return (
              <CollectionCard
                collection={collection}
                block={block}
                cover={gallery_cover}
                coverSize={gallery_cover_size}
                coverAspect={gallery_cover_aspect}
                properties={collectionView.format?.gallery_properties}
                key={blockId}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
