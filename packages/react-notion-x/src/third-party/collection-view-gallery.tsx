import type * as types from 'notion-types'
import type React from 'react'
import { type PageBlock } from 'notion-types'
import { getBlockValue } from 'notion-utils'

import { useNotionContext } from '../context'
import { type CollectionViewProps } from '../types'
import { cs } from '../utils'
import { CollectionCard } from './collection-card'
import { CollectionGroup } from './collection-group'
import { getCollectionGroups } from './collection-utils'

const defaultBlockIds: string[] = []

export function CollectionViewGallery({
  collection,
  collectionView,
  collectionData
}: CollectionViewProps) {
  const isGroupedCollection = collectionView?.format?.collection_group_by

  if (isGroupedCollection) {
    const collectionGroups = getCollectionGroups(
      collection,
      collectionView,
      collectionData
    )

    return collectionGroups.map((group, index) => (
      <CollectionGroup
        key={index}
        {...group}
        collectionViewComponent={Gallery}
      />
    ))
  }

  const blockIds: string[] =
    (collectionData.collection_group_results?.blockIds ??
      (
        collectionData[
        'results:relation:uncategorized' as keyof typeof collectionData
        ] as any
      )?.blockIds ??
      collectionData.blockIds) ||
    defaultBlockIds

  return (
    <Gallery
      collectionView={collectionView}
      collection={collection}
      blockIds={blockIds}
    />
  )
}

function Gallery({
  blockIds,
  collectionView,
  collection
}: {
  blockIds?: string[]
  collection: types.Collection
  collectionView: types.CollectionView
}) {
  const { recordMap } = useNotionContext()
  const {
    gallery_cover = { type: 'none' },
    gallery_cover_size = 'medium',
    gallery_cover_aspect = 'cover',
    inline_collection_first_load_limit
  } = collectionView.format || {}

  const [isExpanded, setIsExpanded] = React.useState(false)

  const loadLimit = inline_collection_first_load_limit?.limit
  const shouldLimit = typeof loadLimit === 'number'

  const showLoadMore =
    shouldLimit && !isExpanded && (blockIds?.length || 0) > loadLimit
  const visibleBlockIds = showLoadMore
    ? blockIds?.slice(0, loadLimit)
    : blockIds

  return (
    <div className='notion-gallery'>
      <div className='notion-gallery-view'>
        <div
          className={cs(
            'notion-gallery-grid',
            `notion-gallery-grid-size-${gallery_cover_size}`
          )}
        >
          {visibleBlockIds?.map((blockId) => {
            const block = getBlockValue(recordMap.block[blockId]) as PageBlock
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

      {showLoadMore && (
        <div
          className='notion-collection-load-more'
          onClick={() => setIsExpanded(true)}
        >
          <svg
            viewBox='0 0 24 24'
            height='16'
            width='16'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 5v14' />
            <path d='m19 12-7 7-7-7' />
          </svg>
          Load more
        </div>
      )}
    </div>
  )
}
