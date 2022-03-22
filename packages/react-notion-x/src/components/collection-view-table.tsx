import React from 'react'

import { CollectionColumnTitle } from './collection-column-title'
import { CollectionGroup } from './collection-group'
import { CollectionViewProps } from '../types'
import { cs, getCollectionGroups } from '../utils'
import { Property } from './property'
import { useNotionContext } from '../context'

export const CollectionViewTable: React.FC<CollectionViewProps> = ({
  collection,
  collectionView,
  collectionData,
  padding,
  width
}) => {
  const isGroupedCollection = collectionView?.format?.collection_group_by

  if (isGroupedCollection) {
    const collectionGroups = getCollectionGroups(
      collection,
      collectionView,
      collectionData,
      padding,
      width
    )

    return collectionGroups.map((group, index) => (
      <CollectionGroup
        key={index}
        {...group}
        collectionViewComponent={(props) => (
          <Table {...props} padding={padding} width={width} />
        )}
        summaryProps={{
          style: {
            paddingLeft: padding,
            paddingRight: padding
          }
        }}
      />
    ))
  }

  return (
    <Table
      blockIds={collectionData['collection_group_results'].blockIds}
      collection={collection}
      collectionView={collectionView}
      padding={padding}
      width={width}
    />
  )
}

function Table({ blockIds, collection, collectionView, width, padding }) {
  const { recordMap } = useNotionContext()

  let properties = []

  if (collectionView.format?.table_properties) {
    properties = collectionView.format?.table_properties.filter(
      (p) => p.visible && collection.schema[p.property]
    )
  } else {
    properties = [{ property: 'title' }].concat(
      Object.keys(collection.schema)
        .filter((p) => p !== 'title')
        .map((property) => ({ property }))
    )
  }

  return (
    <div
      className='notion-table'
      style={{
        width,
        maxWidth: width
      }}
    >
      <div
        className='notion-table-view'
        style={{
          paddingLeft: padding,
          paddingRight: padding
        }}
      >
        {!!properties.length && (
          <>
            <div className='notion-table-header'>
              <div className='notion-table-header-inner'>
                {properties.map((p) => {
                  const schema = collection.schema?.[p.property]
                  const isTitle = p.property === 'title'
                  const style: React.CSSProperties = {}

                  if (p.width) {
                    style.width = p.width
                  } else if (isTitle) {
                    style.width = 280
                  } else {
                    style.width = 200
                    // style.width = `${100.0 / properties.length}%`
                  }

                  return (
                    <div className='notion-table-th' key={p.property}>
                      <div
                        className='notion-table-view-header-cell'
                        style={style}
                      >
                        <div className='notion-table-view-header-cell-inner'>
                          <CollectionColumnTitle schema={schema} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='notion-table-header-placeholder'></div>

            <div className='notion-table-body'>
              {blockIds.map((blockId) => (
                <div className='notion-table-row' key={blockId}>
                  {properties.map((p) => {
                    const schema = collection.schema?.[p.property]
                    const block = recordMap.block[blockId]?.value
                    const data = block?.properties?.[p.property]
                    const isTitle = p.property === 'title'
                    const style: React.CSSProperties = {}

                    if (p.width) {
                      style.width = p.width
                    } else if (isTitle) {
                      style.width = 280
                    } else {
                      style.width = 200
                      // style.width = `${100.0 / properties.length}%`
                    }

                    return (
                      <div
                        key={p.property}
                        className={cs(
                          'notion-table-cell',
                          `notion-table-cell-${schema.type}`
                        )}
                        style={style}
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
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
