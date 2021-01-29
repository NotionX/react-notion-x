import React from 'react'
import { PageBlock } from 'notion-types'

import { CollectionColumnTitle } from './collection-column-title'
import { Property } from './property'
import { useNotionContext } from '../context'

export const CollectionRow: React.FC<{
  block: PageBlock
}> = ({ block }) => {
  const { recordMap } = useNotionContext()
  const collectionId = block.parent_id
  const collection = recordMap.collection[collectionId]?.value
  const schemas = collection?.schema

  if (!collection || !schemas) {
    return null
  }

  let propertyIds = Object.keys(schemas).filter((id) => id !== 'title')

  // filter properties based on visibility
  if (collection.format?.property_visibility) {
    propertyIds = propertyIds.filter(
      (id) =>
        collection.format.property_visibility.find(
          ({ property }) => property === id
        )?.visibility !== 'hide'
    )
  }

  // sort properties
  if (collection.format?.collection_page_properties) {
    // sort properties based on collection page order
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
