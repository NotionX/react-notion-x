import React from 'react'

import { useHotkeys } from 'react-hotkeys-hook'
import { getPageBreadcrumbs } from 'notion-utils'
import { useNotionContext } from '../context'
import { PageIcon } from './page-icon'
import { SearchIcon } from '../icons/search-icon'
import { cs } from '../utils'
import { SearchDialog } from './search-dialog'

export const Header: React.FC<{
  header: React.ElementType
}> = ({ header: CustomHeader }) => {
  const {
    components,
    recordMap,
    rootPageId,
    mapPageUrl,
    searchNotion,
    ...restOfContext
  } = useNotionContext()

  const blockMap = recordMap.block
  const blockIds = Object.keys(blockMap)
  const activePageId = blockIds[0]
  const hasSearch = !!searchNotion

  const breadcrumbs = getPageBreadcrumbs(recordMap, activePageId)

  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const onOpenSearch = React.useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  const onCloseSearch = React.useCallback(() => {
    setIsSearchOpen(false)
  }, [])

  useHotkeys('cmd+p', (event) => {
    onOpenSearch()
    event.preventDefault()
    event.stopPropagation()
  })

  useHotkeys('cmd+k', (event) => {
    onOpenSearch()
    event.preventDefault()
    event.stopPropagation()
  })

  if (!activePageId) {
    return null
  }

  const headerComponents = [
    <div className='breadcrumbs' key='breadcrumbs'>
      {breadcrumbs.map((breadcrumb, index) => {
        const pageLinkProps: any = {}
        const componentMap = {
          pageLink: components.pageLink
        }

        if (breadcrumb.active) {
          componentMap.pageLink = (props) => <div {...props} />
        } else {
          pageLinkProps.href = mapPageUrl(breadcrumb.pageId)
        }

        return (
          <React.Fragment key={breadcrumb.pageId}>
            <componentMap.pageLink
              className={cs('breadcrumb', breadcrumb.active && 'active')}
              {...pageLinkProps}
            >
              {breadcrumb.icon && (
                <PageIcon className='icon' block={breadcrumb.block} />
              )}

              {breadcrumb.title && (
                <span className='title'>{breadcrumb.title}</span>
              )}
            </componentMap.pageLink>

            {index < breadcrumbs.length - 1 && (
              <span className='spacer'>/</span>
            )}
          </React.Fragment>
        )
      })}
    </div>,

    <div className='rhs' key='rhs'>
      {hasSearch && (
        <div
          role='button'
          className={cs('breadcrumb', 'button', 'notion-search-button')}
          onClick={onOpenSearch}
        >
          <SearchIcon className='searchIcon' />

          <span className='title'>Search</span>
        </div>
      )}
    </div>,

    <React.Fragment key='search'>
      {isSearchOpen && hasSearch && (
        <SearchDialog
          isOpen={isSearchOpen}
          rootBlockId={rootPageId || activePageId}
          onClose={onCloseSearch}
          searchNotion={searchNotion}
        />
      )}
    </React.Fragment>
  ]

  if (CustomHeader) {
    return (
      <CustomHeader
        activePageId={activePageId}
        blockIds={blockIds}
        blockMap={blockMap}
        breadcrumbs={breadcrumbs}
        className={'notion-header'}
        components={components}
        hasSearch={hasSearch}
        headerComponents={headerComponents}
        isSearchOpen={isSearchOpen}
        mapPageUrl={mapPageUrl}
        onCloseSearch={onCloseSearch}
        onOpenSearch={onOpenSearch}
        recordMap={recordMap}
        rootPageId={rootPageId}
        searchNotion={searchNotion}
        setIsSearchOpen={setIsSearchOpen}
        {...restOfContext}
      />
    )
  }

  return (
    <header className='notion-header'>
      <div className='nav-header'>
        {headerComponents[0]}
        {headerComponents[1]}
      </div>

      {headerComponents[2]}
    </header>
  )
}
