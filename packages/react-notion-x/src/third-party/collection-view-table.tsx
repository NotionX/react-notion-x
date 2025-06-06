import type React from 'react'

import { useNotionContext } from '../context'
import { type CollectionViewProps } from '../types'
import { cs } from '../utils'
import { CollectionColumnTitle } from './collection-column-title'
import { CollectionGroup } from './collection-group'
import { getCollectionGroups } from './collection-utils'
import { Property } from './property'
import { useClientStyle } from './react-use'

const defaultBlockIds: string[] = []

export function CollectionViewTable({
  collection,
  collectionView,
  collectionData,
  padding,
  width
}: CollectionViewProps) {
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

  const blockIds =
    (collectionData.collection_group_results?.blockIds ??
      collectionData.blockIds) ||
    defaultBlockIds

  return (
    <Table
      blockIds={blockIds}
      collection={collection}
      collectionView={collectionView}
      padding={padding}
      width={width}
    />
  )
}

function Table({
  blockIds = [],
  collection,
  collectionView,
  width,
  padding
}: {
  blockIds?: string[]
} & Omit<CollectionViewProps, 'collectionData'>) {
  const { recordMap, linkTableTitleProperties } = useNotionContext()

  const tableStyle = useClientStyle(
    {
      width,
      maxWidth: width
    },
    { visibility: 'hidden' }
  )

  const tableViewStyle = useClientStyle({
    paddingLeft: padding,
    paddingRight: padding
  })

  let properties = []

  if (collectionView.format?.table_properties) {
    properties = collectionView.format.table_properties.filter(
      (p: any) => p.visible && collection.schema[p.property]
    )
  } else {
    properties = [{ property: 'title' }].concat(
      Object.keys(collection.schema)
        .filter((p) => p !== 'title')
        .map((property) => ({ property }))
    )
  }

  return (
    <div className='notion-table' style={tableStyle}>
      <div className='notion-table-view' style={tableViewStyle}>
        {!!properties.length && (
          <>
            <div className='notion-table-header'>
              <div className='notion-table-header-inner'>
                {properties.map((p: any) => {
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
                          {schema && <CollectionColumnTitle schema={schema} />}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className='notion-table-header-placeholder'></div>

            <div className='notion-table-body'>
              {blockIds?.map((blockId) => (
                <div className='notion-table-row' key={blockId}>
                  {properties.map((p: any) => {
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
                          `notion-table-cell-${schema?.type}`
                        )}
                        style={style}
                      >
                        <Property
                          schema={schema}
                          data={data}
                          block={block}
                          collection={collection}
                          linkToTitlePage={linkTableTitleProperties}
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
