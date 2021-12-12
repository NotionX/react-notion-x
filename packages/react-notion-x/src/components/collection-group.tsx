import React from 'react'

import { Property } from './property'

export const CollectionGroup: React.FC<{
  collection: any
  collectionGroup: any
  collectionViewComponent: React.ElementType
  schema: any
  value: any
}> = ({
  collectionViewComponent: CollectionViewComponent,
  collection,
  collectionGroup,
  schema,
  value,
  ...rest
}) => {
  return (
    <details open className='notion-collection-group'>
      <summary className='notion-collection-group-title'>
        <div>
          <Property schema={schema} data={[[value]]} collection={collection} />
          <span className='notion-board-th-count'>{collectionGroup.total}</span>
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
