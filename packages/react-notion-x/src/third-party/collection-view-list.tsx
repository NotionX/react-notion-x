import type * as types from 'notion-types'
import type React from 'react'
import { type PageBlock } from 'notion-types'

import { PageIcon } from '../components/page-icon'
import { useNotionContext } from '../context'
import { type CollectionViewProps } from '../types'
import { CollectionGroup } from './collection-group'
import { getCollectionGroups } from './collection-utils'
import { Property } from './property'

const defaultBlockIds: string[] = []

export function CollectionViewList({
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

    return collectionGroups.map((group, key) => (
      <CollectionGroup key={key} {...group} collectionViewComponent={List} />
    ))
  }

  const blockIds =
    (collectionData.collection_group_results?.blockIds ??
      collectionData.blockIds) ||
    defaultBlockIds

  return (
    <List
      blockIds={blockIds}
      collection={collection}
      collectionView={collectionView}
    />
  )
}

function List({
  blockIds = [],
  collection,
  collectionView
}: {
  blockIds?: string[]
  collection: types.Collection
  collectionView: types.CollectionView
}) {
  const { components, recordMap, mapPageUrl } = useNotionContext()

  return (
    <div className='notion-list-collection'>
      <div className='notion-list-view'>
        <div className='notion-list-body'>
          {blockIds?.map((blockId) => {
            const block = recordMap.block[blockId]?.value as PageBlock
            if (!block) return null

            const titleSchema = collection.schema.title
            const titleData = block?.properties?.title

            return (
              <components.PageLink
                className='notion-list-item notion-page-link'
                href={mapPageUrl(block.id)}
                key={blockId}
              >
                <div className='notion-list-item-title'>
                  <PageIcon
                    block={block}
                    className='notion-page-title-icon'
                    hideDefaultIcon
                  />
                  <Property
                    schema={titleSchema}
                    data={titleData}
                    block={block}
                    collection={collection}
                    linkToTitlePage={false}
                  />
                </div>

                <div className='notion-list-item-body'>
                  {collectionView.format?.list_properties
                    ?.filter((p: any) => p.visible)
                    .map((p: any) => {
                      const schema = collection.schema[p.property]
                      const data =
                        block &&
                        block.properties?.[
                          p.property as keyof typeof block.properties
                        ]

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
              </components.PageLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
