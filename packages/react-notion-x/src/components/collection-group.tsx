import React from 'react'

import { Property } from './property'

export const CollectionGroup: React.FC<{
  component: React.ElementType
  collectionGroup: any
  schema: any
  value: any
  collection: any
}> = ({ component: Component, collectionGroup, schema, value, collection }) => {
  return (
    <details open className='notion-collection-group'>
      <summary className='notion-collection-group-title'>
        <div>
          <Property schema={schema} data={[[value]]} collection={collection} />
          <span className='notion-board-th-count'>{collectionGroup.total}</span>
        </div>
      </summary>

      <Component blockIds={collectionGroup.blockIds} />
    </details>
  )
}
