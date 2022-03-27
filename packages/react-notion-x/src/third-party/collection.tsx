import React from 'react'
import * as types from 'notion-types'
import { getBlockParentPage, getTextContent } from 'notion-utils'
import { useLocalStorage, useWindowSize } from 'react-use'
import Dropdown from 'rc-dropdown'
import Menu, { Item as MenuItem } from 'rc-menu'

import { CollectionRow } from './collection-row'
import { CollectionViewIcon } from '../icons/collection-view-icon'
import { ChevronDownIcon } from '../icons/chevron-down-icon'
import { CollectionView } from './collection-view'
import { PageIcon } from '../components/page-icon'
import {
  NotionContext,
  NotionContextProvider,
  useNotionContext
} from '../context'
import { cs } from '../utils'

const isServer = typeof window === 'undefined'
const triggers = ['click']

export const Collection: React.FC<{
  block:
    | types.CollectionViewBlock
    | types.CollectionViewPageBlock
    | types.PageBlock
  className?: string
  ctx: NotionContext
}> = ({ block, className, ctx }) => {
  /**
   * NOTE: there is a weird oddity of us using multiple bundles for collections,
   * where `useNotionContext` returns a *different* context than for the main
   * bundle.
   *
   * This is due to `React.createContext` being called in each bundle which includes
   * `../context.ts`.
   *
   * To circumvent this issue, we're passing the context value directly to
   * `Collection` so all children have the correct context values.
   */
  // console.log('Collection', Object.keys(recordMap.block).length)

  if (block.type === 'page') {
    if (block.parent_table !== 'collection') {
      return null
    }

    return (
      <NotionContextProvider {...ctx}>
        <div className='notion-collection-page-properties'>
          <CollectionRow
            block={block as types.PageBlock}
            className={className}
          />
        </div>
      </NotionContextProvider>
    )
  } else {
    return (
      <NotionContextProvider {...ctx}>
        <CollectionViewBlock block={block} className={className} />
      </NotionContextProvider>
    )
  }
}

const CollectionViewBlock: React.FC<{
  block: types.CollectionViewBlock | types.CollectionViewPageBlock
  className?: string
}> = ({ block, className }) => {
  const { recordMap, showCollectionViewDropdown } = useNotionContext()
  const { collection_id: collectionId, view_ids: viewIds } = block

  const [collectionState, setCollectionState] = useLocalStorage(block.id, {
    collectionViewId: viewIds[0]
  })

  const collectionViewId =
    viewIds.find((id) => id === collectionState.collectionViewId) || viewIds[0]

  const onChangeView = React.useCallback(
    ({ key: collectionViewId }) => {
      console.log('change collection view', collectionViewId)

      setCollectionState({
        ...collectionState,
        collectionViewId
      })
    },
    [collectionState, setCollectionState]
  )

  let { width } = useWindowSize()
  if (isServer) {
    width = 1024
  }

  // TODO: customize for mobile?
  const maxNotionBodyWidth = 708
  let notionBodyWidth = maxNotionBodyWidth

  const parentPage = getBlockParentPage(block, recordMap)
  if (parentPage?.format?.page_full_width) {
    notionBodyWidth = (width - 2 * Math.min(96, width * 0.08)) | 0
  } else {
    notionBodyWidth =
      width < maxNotionBodyWidth
        ? (width - width * 0.02) | 0 // 2vw
        : maxNotionBodyWidth
  }

  const padding = isServer ? 96 : ((width - notionBodyWidth) / 2) | 0
  // console.log({ width, notionBodyWidth, padding })

  const collection = recordMap.collection[collectionId]?.value
  const collectionView = recordMap.collection_view[collectionViewId]?.value
  const collectionData =
    recordMap.collection_query[collectionId]?.[collectionViewId]

  if (!(collection && collectionView && collectionData)) {
    console.warn('skipping missing collection view for block', block.id, {
      collectionId,
      collectionViewId,
      collectionView,
      collectionData,
      recordMap
    })
    return null
  }

  const style: React.CSSProperties = {}
  if (collectionView.type === 'table' || collectionView.type === 'board') {
    style.paddingLeft = padding
    style.paddingRight = padding
  }

  const title = getTextContent(collection.name).trim()
  if (collection.icon) {
    block.format = {
      ...block.format,
      page_icon: collection.icon
    }
  }

  /**
    TODO: this is hacky and really shouldn't be necessary, but when imported by
    next.js 12 (webpack 5), the default exports from rc-dropdown and rc-menu are
    replaced with commonjs equivalents `{ default: Dropdown }` instead of `Dropdown`
    directly.

    The safest fix would be to bundle the react-notion-x exports to prevent to
    guarantee that all of its imports are handled as expected a library build tima,
    but that will need to come in a later revision.
  */
  const DropdownSafe = (Dropdown as any).default ?? Dropdown
  const MenuSafe = (Menu as any).default ?? Menu
  // console.log('Collection', { Dropdown, Menu, MenuItem, DropdownSafe, MenuSafe })

  return (
    <div className={cs('notion-collection', className)}>
      <div className='notion-collection-header' style={style}>
        {title && (
          <div className='notion-collection-header-title'>
            <>
              <PageIcon
                block={block}
                className='notion-page-title-icon'
                hideDefaultIcon
              />

              {title}
            </>
          </div>
        )}

        {viewIds.length > 1 && showCollectionViewDropdown && (
          <DropdownSafe
            trigger={triggers}
            overlay={
              <MenuSafe onSelect={onChangeView}>
                {viewIds.map((viewId) => (
                  <MenuItem
                    key={viewId}
                    className='notion-collection-view-type-menu-item'
                  >
                    <CollectionViewColumnDesc
                      collectionView={recordMap.collection_view[viewId]?.value}
                    />
                  </MenuItem>
                ))}
              </MenuSafe>
            }
            animation='slide-up'
          >
            <CollectionViewColumnDesc
              className='notion-collection-view-dropdown'
              collectionView={collectionView}
            >
              <ChevronDownIcon className='notion-collection-view-dropdown-icon' />
            </CollectionViewColumnDesc>
          </DropdownSafe>
        )}
      </div>

      <CollectionView
        collection={collection}
        collectionView={collectionView}
        collectionData={collectionData}
        padding={padding}
        width={width}
      />
    </div>
  )
}

const CollectionViewColumnDesc: React.FC<{
  collectionView: types.CollectionView
  className?: string
  children?: React.ReactNode
}> = ({ collectionView, className, children, ...rest }) => {
  const { type } = collectionView
  const name =
    collectionView.name || `${type[0].toUpperCase()}${type.slice(1)} view`

  return (
    <div className={cs('notion-collection-view-type', className)} {...rest}>
      <CollectionViewIcon
        className='notion-collection-view-type-icon'
        type={type}
      />

      <span className='notion-collection-view-type-title'>{name}</span>

      {children}
    </div>
  )
}
