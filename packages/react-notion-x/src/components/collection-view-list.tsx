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

  const isGrouped = collectionView.format.collection_group_by

  if (!isGrouped) {
    return <List blockIds={collectionData.blockIds} />
  }

  function List({ blockIds }) {
    return (
      <div className='notion-list-collection'>
        <div className='notion-list-view'>
          <div className='notion-list-body'>
            {blockIds.map((blockId) => {
              const block = recordMap.block[blockId]?.value as PageBlock
              if (!block) return null

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

  return (
    <>
      {collectionView?.format?.collection_groups?.map((p) => {
        let value = p?.value?.value ||  'uncategorized'  
        const group =  (collectionData as any)[`results:${p.value.type}:${value}`]
        const schema = collection.schema[p.property]
        
        if (!group || !schema || p.hidden) {
          return null
        }

        return (
          <div>
            {group ? (
              <Property
                schema={schema}
                data={[[p.value?.value]]}
                collection={collection}
              />
            ) : (
              <span>No group</span>
            )}

            <List blockIds={group.blockIds} />
            <span className='notion-board-th-count'>{group.total}</span>
          </div>
        )
      })}
    </>
  )
}
