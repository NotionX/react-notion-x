import type * as types from 'notion-types'
import { type PageBlock } from 'notion-types'
import { getBlockValue } from 'notion-utils'
import React from 'react'

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

  const [isExpanded, setIsExpanded] = React.useState(false)

  const { inline_collection_first_load_limit } = collectionView.format || {}
  const loadLimit = inline_collection_first_load_limit?.limit
  const shouldLimit = typeof loadLimit === 'number'

  const showLoadMore =
    shouldLimit && !isExpanded && (blockIds?.length || 0) > loadLimit
  const visibleBlockIds = showLoadMore
    ? blockIds?.slice(0, loadLimit)
    : blockIds

  return (
    <div className='notion-list-collection'>
      <div className='notion-list-view'>
        <div className='notion-list-body'>
          {visibleBlockIds?.map((blockId) => {
            const block = getBlockValue(recordMap.block[blockId]) as PageBlock
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
                    ?.filter((p: any) => p.visible && p.property !== 'title')
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
