import type React from 'react'
import { type CollectionPropertySchema } from 'notion-types'

import { PropertyIcon } from '../icons/property-icon'

export function CollectionColumnTitle({
  schema
}: {
  schema: CollectionPropertySchema
}) {
  return (
    <div className='notion-collection-column-title'>
      <PropertyIcon
        className='notion-collection-column-title-icon'
        type={schema.type}
      />

      <div className='notion-collection-column-title-body'>{schema.name}</div>
    </div>
  )
}
