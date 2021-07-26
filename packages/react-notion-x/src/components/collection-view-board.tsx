import React from 'react'
import { PageBlock } from 'notion-types'

import { CollectionViewProps } from '../types'
import { cs } from '../utils'
import { CollectionCard } from './collection-card'
import { EmptyIcon } from '../icons/empty-icon'
import { Property } from './property'
import { useNotionContext } from '../context'

export const CollectionViewBoard: React.FC<CollectionViewProps> = ({
  collection,
  collectionView,
  collectionData,
  padding
}) => {
  const { recordMap } = useNotionContext()
  const {
    board_cover = { type: 'none' },
    board_cover_size = 'medium',
    board_cover_aspect = 'cover'
  } = collectionView.format || {}

  // console.log('board', { collection, collectionView, collectionData })

  const boardGroups = collectionView.format.board_groups2 || collectionView.format.board_columns

  return (
    <div className='notion-board'>
      <div
        className={cs(
          'notion-board-view',
          `notion-board-view-size-${board_cover_size}`
        )}
        style={{
          paddingLeft: padding
        }}
      >
        <div className='notion-board-header'>
          <div className='notion-board-header-inner'>
            {boardGroups.map((p, index) => {
              if (!collectionData.groupResults) { //no groupResults in the data when collection is in a toggle
                return null
              }
              const group = collectionData.groupResults![index]
              const schema = collection.schema[p.property]

              if (!group || !schema || p.hidden) {
                return null
              }

              return (
                <div className='notion-board-th' key={index}>
                  <div className='notion-board-th-body'>
                    {group.value?.value ? (
                      <Property
                        schema={schema}
                        data={[[group.value?.value]]}
                        collection={collection}
                      />
                    ) : (
                      <span>
                        <EmptyIcon className='notion-board-th-empty' /> No
                        Select
                      </span>
                    )}

                    <span className='notion-board-th-count'>{group.total}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className='notion-board-header-placeholder' />

        <div className='notion-board-body'>
          {boardGroups.map((p, index) => {
            if (!collectionData.groupResults) {
              return null
            }
            const group = collectionData.groupResults![index]
            const schema = collection.schema[p.property]

            if (!group || !schema || p.hidden) {
              return null
            }

            return (
              <div className='notion-board-group' key={index}>
                {group.blockIds.map((blockId) => {
                  const block = recordMap.block[blockId]?.value as PageBlock
                  if (!block) return null

                  return (
                    <CollectionCard
                      className='notion-board-group-card'
                      collection={collection}
                      block={block}
                      cover={board_cover}
                      coverSize={board_cover_size}
                      coverAspect={board_cover_aspect}
                      properties={collectionView.format?.board_properties}
                      key={blockId}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
