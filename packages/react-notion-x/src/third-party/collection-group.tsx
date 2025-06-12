import type React from 'react'

import { type CollectionGroupProps } from '../types'
import { Property } from './property'

export function CollectionGroup({
  collectionViewComponent: CollectionViewComponent,
  collection,
  collectionGroup,
  schema,
  value,
  hidden,
  summaryProps,
  detailsProps,
  ...rest
}: CollectionGroupProps) {
  if (hidden) return null

  return (
    <details open className='notion-collection-group' {...detailsProps}>
      <summary className='notion-collection-group-title' {...summaryProps}>
        <div>
          <Property schema={schema} data={[[value]]} collection={collection} />

          <span className='notion-board-th-count'>
            {collectionGroup?.total}
          </span>
        </div>
      </summary>

      <CollectionViewComponent
        collection={collection}
        collectionGroup={collectionGroup}
        {...rest}
      />
    </details>
  )
}
