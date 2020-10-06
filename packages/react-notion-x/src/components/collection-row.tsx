import * as React from 'react'

import * as types from '../types'
import { CollectionColumnTitle } from './collection-column-title'
import { Property } from './property'
import { useNotionContext } from '../context'

const CollectionRow: React.FC<{
  block: types.PageBlock
}> = ({ block }) => {
  const { recordMap } = useNotionContext()
  const collectionId = block.parent_id
  const collection = recordMap.collection[collectionId]?.value
  const schemas = collection?.schema

  if (!collection || !schemas) {
    return null
  }

  const propertyIds = Object.keys(schemas).filter((id) => id !== 'title')
  if (collection.format?.collection_page_properties) {
    // sort properties based on collectino page order
    const idToIndex = collection.format?.collection_page_properties.reduce(
      (acc, p, i) => ({
        ...acc,
        [p.property]: i
      }),
      {}
    )

    propertyIds.sort((a, b) => idToIndex[a] - idToIndex[b])
  } else {
    // default to sorting properties alphabetically based on name
    propertyIds.sort((a, b) => schemas[a].name.localeCompare(schemas[b].name))
  }

  return (
    <div className='notion-collection-row'>
      <div className='notion-collection-row-body'>
        {propertyIds.map((id) => {
          const schema = schemas[id]

          return (
            <div className='notion-collection-row-property' key={id}>
              <CollectionColumnTitle schema={schema} />

              <div className='notion-collection-row-value'>
                <Property
                  schema={schema}
                  data={block.properties?.[id]}
                  block={block}
                  collection={collection}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CollectionRow
