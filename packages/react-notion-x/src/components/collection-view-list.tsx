import React from 'react'
import { PageBlock } from 'notion-types'

import { CollectionViewProps } from '../types'
import { Property } from './property'
import { useNotionContext } from '../context'

export const CollectionViewList: React.FC<CollectionViewProps> = ({
  collection,
  collectionView,
  collectionData
}) => {
  const { components, recordMap, mapPageUrl } = useNotionContext()
  // console.log('list', { collection, collectionView, collectionData })

  return (
    <div className='notion-list-collection'>
      <div className='notion-list-view'>
        <div className='notion-list-body'>
          {collectionData.blockIds.map((blockId) => {
            const block = recordMap.block[blockId]?.value as PageBlock
            if(!block) return null

            const titleSchema = collection.schema.title
            const titleData = block?.properties?.title

            return (
              <components.pageLink
                className='notion-list-item notion-page-link'
                href={mapPageUrl(block.id)}
                key={blockId}
              >
                <div className='notion-list-item-title'>
                  <Property
                    schema={titleSchema}
                    data={titleData}
                    block={block}
                    collection={collection}
                  />
                </div>

                <div className='notion-list-item-body'>
                  {collectionView.format?.list_properties
                    ?.filter((p) => p.visible)
                    .map((p) => {
                      const schema = collection.schema[p.property]
                      const data = block && block.properties?.[p.property]

                      // console.log('list item body', p, schema, data)
                      if (!schema) {
                        return null
                      }

                      return (
                        <div
                          className='notion-list-item-property'
                          key={p.property}
                        >
                          <Property
                            schema={schema}
                            data={data}
                            block={block}
                            collection={collection}
                          />
                        </div>
                      )
                    })}
                </div>
              </components.pageLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
