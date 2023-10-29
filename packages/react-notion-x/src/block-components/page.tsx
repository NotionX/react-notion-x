import * as React from 'react'

import * as types from 'notion-types'
import {
  getBlockCollectionId,
  getBlockIcon,
  getPageTableOfContents,
  getTextContent
} from 'notion-utils'

import { LazyImage } from '../components/lazy-image'
import { PageAside } from '../components/page-aside'
import { PageIcon } from '../components/page-icon'
import { PageTitle } from '../components/page-title'
import { Text } from '../components/text'
import { useNotionContext } from '../context'
import { cs, isUrl } from '../utils'

const pageCoverStyleCache: Record<string, object> = {}

export const Page: React.FC<{
  block: types.Block
  blockId: string
  level: number

  className?: string
  bodyClassName?: string

  header?: React.ReactNode
  footer?: React.ReactNode
  pageHeader?: React.ReactNode
  pageFooter?: React.ReactNode
  pageTitle?: React.ReactNode
  pageAside?: React.ReactNode
  pageCover?: React.ReactNode

  hideBlockId?: boolean
  disableHeader?: boolean

  children?: React.ReactNode
}> = (props) => {
  const {
    block,
    blockId,
    children,
    level,
    className,
    bodyClassName,
    header,
    footer,
    pageHeader,
    pageFooter,
    pageTitle,
    pageAside,
    pageCover,
    disableHeader
  } = props

  const [activeSection, setActiveSection] = React.useState(null)

  const ctx = useNotionContext()
  const {
    components,
    fullPage,
    darkMode,
    recordMap,
    mapPageUrl,
    mapImageUrl,
    showTableOfContents,
    minTableOfContentsItems,
    defaultPageIcon,
    defaultPageCover,
    defaultPageCoverPosition
  } = ctx

  if (!block.properties) return null

  if (level === 0) {
    const {
      page_icon = defaultPageIcon,
      page_cover = defaultPageCover,
      page_cover_position = defaultPageCoverPosition,
      page_full_width,
      page_small_text
    } = block.format || {}

    if (fullPage) {
      const properties =
        block.type === 'page'
          ? block.properties
          : {
              title:
                recordMap.collection[getBlockCollectionId(block, recordMap)]
                  ?.value?.name
            }

      const coverPosition = (1 - (page_cover_position || 0.5)) * 100
      const pageCoverObjectPosition = `center ${coverPosition}%`
      let pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition]
      if (!pageCoverStyle) {
        pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition] = {
          objectPosition: pageCoverObjectPosition
        }
      }

      const pageIcon = getBlockIcon(block, recordMap) ?? defaultPageIcon
      const isPageIconUrl = pageIcon && isUrl(pageIcon)

      const toc = getPageTableOfContents(block as types.PageBlock, recordMap)

      const hasToc =
        showTableOfContents && toc.length >= minTableOfContentsItems
      const hasAside = (hasToc || pageAside) && !page_full_width
      const hasPageCover = pageCover || page_cover

      return (
        <div
          className={cs(
            'notion',
            'notion-app',
            darkMode ? 'dark-mode' : 'light-mode',
            blockId,
            className
          )}
        >
          <div className='notion-viewport' />

          <div className='notion-frame'>
            {!disableHeader && <components.Header block={block} />}
            {header}

            <div className='notion-page-scroller'>
              {hasPageCover &&
                (pageCover ? (
                  pageCover
                ) : (
                  <div className='notion-page-cover-wrapper'>
                    <LazyImage
                      src={mapImageUrl(page_cover, block)}
                      alt={getTextContent(properties?.title)}
                      priority={true}
                      className='notion-page-cover'
                      style={pageCoverStyle}
                    />
                  </div>
                ))}

              <main
                className={cs(
                  'notion-page',
                  hasPageCover
                    ? 'notion-page-has-cover'
                    : 'notion-page-no-cover',
                  page_icon ? 'notion-page-has-icon' : 'notion-page-no-icon',
                  isPageIconUrl
                    ? 'notion-page-has-image-icon'
                    : 'notion-page-has-text-icon',
                  'notion-full-page',
                  page_full_width && 'notion-full-width',
                  page_small_text && 'notion-small-text',
                  bodyClassName
                )}
              >
                {page_icon && (
                  <PageIcon
                    block={block}
                    defaultIcon={defaultPageIcon}
                    inline={false}
                  />
                )}

                {pageHeader}

                <h1 className='notion-title'>
                  {pageTitle ?? (
                    <Text value={properties?.title} block={block} />
                  )}
                </h1>

                {(block.type === 'collection_view_page' ||
                  (block.type === 'page' &&
                    block.parent_table === 'collection')) && (
                  <components.Collection block={block} ctx={ctx} />
                )}

                {block.type !== 'collection_view_page' && (
                  <div
                    className={cs(
                      'notion-page-content',
                      hasAside && 'notion-page-content-has-aside',
                      hasToc && 'notion-page-content-has-toc'
                    )}
                  >
                    <article className='notion-page-content-inner'>
                      {children}
                    </article>

                    {hasAside && (
                      <PageAside
                        toc={toc}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        hasToc={hasToc}
                        hasAside={hasAside}
                        pageAside={pageAside}
                      />
                    )}
                  </div>
                )}

                {pageFooter}
              </main>

              {footer}
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <main
          className={cs(
            'notion',
            darkMode ? 'dark-mode' : 'light-mode',
            'notion-page',
            page_full_width && 'notion-full-width',
            page_small_text && 'notion-small-text',
            blockId,
            className,
            bodyClassName
          )}
        >
          <div className='notion-viewport' />

          {pageHeader}

          {(block.type === 'collection_view_page' ||
            (block.type === 'page' && block.parent_table === 'collection')) && (
            <components.Collection block={block} ctx={ctx} />
          )}

          {block.type !== 'collection_view_page' && children}

          {pageFooter}
        </main>
      )
    }
  } else {
    const blockColor = block.format?.block_color

    return (
      <components.PageLink
        className={cs(
          'notion-page-link',
          blockColor && `notion-${blockColor}`,
          blockId
        )}
        href={mapPageUrl(block.id)}
      >
        <PageTitle block={block} />
      </components.PageLink>
    )
  }
}
