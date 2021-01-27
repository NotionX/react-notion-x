import * as React from 'react'
import dynamic from 'next/dynamic'
import throttle from 'lodash.throttle'
import { getBlockIcon } from 'notion-utils'

import * as types from './types'
import { Asset } from './components/asset'
import { Checkbox } from './components/checkbox'
import { PageIcon } from './components/page-icon'
import { PageTitle } from './components/page-title'
import { LinkIcon } from './icons/link-icon'
import { PageHeader } from './components/page-header'
import { GoogleDrive } from './components/google-drive'
import { Audio } from './components/audio'
import { File } from './components/file'
import { Equation } from './components/equation'
import { GracefulImage } from './components/graceful-image'
import { LazyImage } from './components/lazy-image'
import { useNotionContext } from './context'
import {
  cs,
  getTextContent,
  getListNumber,
  getPageTableOfContents,
  getBlockParentPage,
  uuidToId,
  isUrl
} from './utils'
import { Text } from './components/text'

// eagerly load heavier components synchronously
// import Code from './components/code'
// import Collection from './components/collection'
// import CollectionRow from './components/collection-row'

// load heavier components asynchronously
const Code = dynamic(() => import('./components/code'))
const Collection = dynamic(() => import('./components/collection'))
// TODO: there seems to be a bug causing SSR to fail for pages with
// CollectionRows. This manifests as corrupted DOM with weird rendering
// artifacts when loaded directly from the server which doesn't repro when
// loading the same page client-side. It seems to be related to our use of
// next/dynamic and react hydration.
const CollectionRow = dynamic(() => import('./components/collection-row'), {
  ssr: false
})

interface BlockProps {
  block: types.Block
  level: number

  className?: string
  bodyClassName?: string

  footer?: React.ReactNode
  pageHeader?: React.ReactNode
  pageFooter?: React.ReactNode
  pageAside?: React.ReactNode
}

export const Block: React.FC<BlockProps> = (props) => {
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
  } = useNotionContext()

  const {
    block,
    children,
    level,
    className,
    bodyClassName,
    footer,
    pageHeader,
    pageFooter,
    pageAside
  } = props

  if (!block) {
    return null
  }

  // ugly hack to make viewing raw collection views work properly
  // e.g., 6d886ca87ab94c21a16e3b82b43a57fb
  if (level === 0 && block.type === 'collection_view') {
    ;(block as any).type = 'collection_view_page'
  }

  switch (block.type) {
    case 'collection_view_page':
    // fallthrough
    case 'page':
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
                  title: recordMap.collection[block.collection_id]?.value?.name
                }

          const coverPosition = (1 - (page_cover_position || 0.5)) * 100

          const pageIcon = getBlockIcon(block, recordMap) ?? defaultPageIcon
          const isPageIconUrl = pageIcon && isUrl(pageIcon)

          const toc = getPageTableOfContents(
            block as types.PageBlock,
            recordMap
          )

          const hasToc =
            showTableOfContents && toc.length >= minTableOfContentsItems
          const hasAside = hasToc || pageAside

          const [activeSection, setActiveSection] = React.useState(null)

          const throttleMs = 100

          // this scrollspy logic was originally based on
          // https://github.com/Purii/react-use-scrollspy
          const actionSectionScrollSpy = throttle(() => {
            const sections = document.getElementsByClassName('notion-h')

            let prevBBox: DOMRect = null
            let currentSectionId = activeSection

            for (let i = 0; i < sections.length; ++i) {
              const section = sections[i]
              if (!section || !(section instanceof Element)) continue

              if (!currentSectionId) {
                currentSectionId = section.getAttribute('data-id')
              }

              const bbox = section.getBoundingClientRect()
              const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
              const offset = Math.max(150, prevHeight / 4)

              // GetBoundingClientRect returns values relative to viewport
              if (bbox.top - offset < 0) {
                currentSectionId = section.getAttribute('data-id')

                prevBBox = bbox
                continue
              }

              // No need to continue loop, if last element has been detected
              break
            }

            setActiveSection(currentSectionId)
          }, throttleMs)

          if (hasToc) {
            React.useEffect(() => {
              window.addEventListener('scroll', actionSectionScrollSpy)

              actionSectionScrollSpy()

              return () => {
                window.removeEventListener('scroll', actionSectionScrollSpy)
              }
            }, [])
          }

          return (
            <div
              className={cs(
                'notion',
                'notion-app',
                darkMode && 'notion-dark',
                className
              )}
            >
              <div className='notion-viewport' />

              <div className='notion-frame'>
                <PageHeader />

                <div className='notion-page-scroller'>
                  {page_cover && (
                    <LazyImage
                      src={mapImageUrl(page_cover, block)}
                      alt={getTextContent(properties?.title)}
                      className='notion-page-cover'
                      style={{
                        objectPosition: `center ${coverPosition}%`
                      }}
                    />
                  )}

                  <main
                    className={cs(
                      'notion-page',
                      page_cover
                        ? 'notion-page-has-cover'
                        : 'notion-page-no-cover',
                      page_icon
                        ? 'notion-page-has-icon'
                        : 'notion-page-no-icon',
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
                      <div className='notion-page-icon-wrapper'>
                        <PageIcon block={block} defaultIcon={defaultPageIcon} />
                      </div>
                    )}

                    {pageHeader}

                    <div className='notion-title'>
                      <Text value={properties?.title} block={block} />
                    </div>

                    {block.type === 'page' &&
                      block.parent_table === 'collection' && (
                        <CollectionRow block={block} />
                      )}

                    {block.type === 'collection_view_page' && (
                      <Collection block={block} />
                    )}

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
                        <aside className='notion-aside'>
                          {hasToc && (
                            <div className='notion-aside-table-of-contents'>
                              <div className='notion-aside-table-of-contents-header'>
                                Table of Contents
                              </div>

                              <nav
                                className={cs(
                                  'notion-table-of-contents',
                                  !darkMode && 'notion-gray'
                                )}
                              >
                                {toc.map((tocItem) => {
                                  const id = uuidToId(tocItem.id)

                                  return (
                                    <a
                                      key={id}
                                      href={`#${id}`}
                                      className={cs(
                                        'notion-table-of-contents-item',
                                        `notion-table-of-contents-item-indent-level-${tocItem.indentLevel}`,
                                        activeSection === id &&
                                          'notion-table-of-contents-active-item'
                                      )}
                                    >
                                      <span
                                        className='notion-table-of-contents-item-body'
                                        style={{
                                          display: 'inline-block',
                                          marginLeft: tocItem.indentLevel * 16
                                        }}
                                      >
                                        {tocItem.text}
                                      </span>
                                    </a>
                                  )
                                })}
                              </nav>
                            </div>
                          )}

                          {pageAside}
                        </aside>
                      )}
                    </div>

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
                darkMode && 'notion-dark',
                'notion-page',
                page_full_width && 'notion-full-width',
                page_small_text && 'notion-small-text',
                className,
                bodyClassName
              )}
            >
              <div className='notion-viewport' />

              {pageHeader}

              {block.type === 'page' && block.parent_table === 'collection' && (
                <CollectionRow block={block} />
              )}

              {block.type === 'collection_view_page' && (
                <Collection block={block} />
              )}

              {children}

              {pageFooter}
            </main>
          )
        }
      } else {
        const blockColor = block.format?.block_color

        return (
          <components.pageLink
            className={cs(
              'notion-page-link',
              blockColor && `notion-${blockColor}`
            )}
            href={mapPageUrl(block.id)}
          >
            <PageTitle block={block} />
          </components.pageLink>
        )
      }

    case 'header':
    // fallthrough
    case 'sub_header':
    // fallthrough
    case 'sub_sub_header': {
      if (!block.properties) return null

      const blockColor = block.format?.block_color
      const id = uuidToId(block.id)
      const title =
        getTextContent(block.properties.title) || `Notion Header ${id}`

      return (
        <h3
          className={cs(
            block.type === 'header' && 'notion-h notion-h1',
            block.type === 'sub_header' && 'notion-h notion-h2',
            block.type === 'sub_sub_header' && 'notion-h notion-h3',
            blockColor && `notion-${blockColor}`
          )}
          data-id={id}
        >
          <div id={id} className='notion-header-anchor' />

          <a className='notion-hash-link' href={`#${id}`} title={title}>
            <LinkIcon />
          </a>

          <Text value={block.properties.title} block={block} />
        </h3>
      )
    }

    case 'divider':
      return <hr className='notion-hr' />

    case 'text':
      if (!block.properties) {
        return <div className='notion-blank'>&nbsp;</div>
      }

      const blockColor = block.format?.block_color

      return (
        <div
          className={cs('notion-text', blockColor && `notion-${blockColor}`)}
        >
          <Text value={block.properties.title} block={block} />

          {children && <div className='notion-text-children'>{children}</div>}
        </div>
      )

    case 'bulleted_list':
    // fallthrough
    case 'numbered_list':
      const wrapList = (content: React.ReactNode, start?: number) =>
        block.type === 'bulleted_list' ? (
          <ul className='notion-list notion-list-disc'>{content}</ul>
        ) : (
          <ol start={start} className='notion-list notion-list-numbered'>
            {content}
          </ol>
        )

      let output: JSX.Element | null = null

      if (block.content) {
        output = (
          <>
            {block.properties && (
              <li>
                <Text value={block.properties.title} block={block} />
              </li>
            )}
            {wrapList(children)}
          </>
        )
      } else {
        output = block.properties ? (
          <li>
            <Text value={block.properties.title} block={block} />
          </li>
        ) : null
      }

      const isTopLevel =
        block.type !== recordMap.block[block.parent_id]?.value?.type
      const start = getListNumber(block.id, recordMap.block)

      return isTopLevel ? wrapList(output, start) : output

    case 'tweet':
    // fallthrough
    case 'maps':
    // fallthrough
    case 'pdf':
    // fallthrough
    case 'figma':
    // fallthrough
    case 'image':
    // fallthrough
    case 'gist':
    // fallthrough
    case 'embed':
    // fallthrough
    case 'video':
      const value = block as types.BaseContentBlock

      return (
        <figure
          className={cs(
            'notion-asset-wrapper',
            `notion-asset-wrapper-${block.type}`,
            block.format?.block_full_width && 'notion-asset-wrapper-full'
          )}
        >
          <Asset block={block} />

          {value?.properties?.caption && (
            <figcaption className='notion-asset-caption'>
              <Text value={block.properties.caption} block={block} />
            </figcaption>
          )}
        </figure>
      )

    case 'drive':
      return <GoogleDrive block={block as types.GoogleDriveBlock} />

    case 'audio':
      return <Audio block={block as types.AudioBlock} />

    case 'file':
      return <File block={block as types.FileBlock} />

    case 'equation':
      const math = block.properties.title[0][0]
      if (!math) return null
      return <Equation math={math} block />

    case 'code': {
      if (block.properties.title) {
        const content = block.properties.title[0][0]
        const language = block.properties.language[0][0]
        return <Code key={block.id} language={language || ''} code={content} />
      }
      break
    }

    case 'column_list':
      return <div className='notion-row'>{children}</div>

    case 'column':
      // note: notion uses 46px
      const spacerWidth = `min(32px, 4vw)`
      const ratio = block.format?.column_ratio || 0.5
      const parent = recordMap.block[block.parent_id]?.value
      const columns =
        parent?.content?.length || Math.max(2, Math.ceil(1.0 / ratio))
      console.log(block, { ratio, columns })

      const width = `calc((100% - (${
        columns - 1
      } * ${spacerWidth}px)) * ${ratio})`
      const style = { width }

      return (
        <>
          <div className='notion-column' style={style}>
            {children}
          </div>

          <div className='notion-spacer' />
        </>
      )

    case 'quote': {
      if (!block.properties) return null

      const blockColor = block.format?.block_color

      return (
        <blockquote
          className={cs('notion-quote', blockColor && `notion-${blockColor}`)}
        >
          <Text value={block.properties.title} block={block} />
        </blockquote>
      )
    }

    case 'collection_view':
      return <Collection block={block} />

    case 'callout':
      return (
        <div
          className={cs(
            'notion-callout',
            block.format?.block_color &&
              `notion-${block.format?.block_color}_co`
          )}
        >
          <PageIcon block={block} />

          <div className='notion-callout-text'>
            <Text value={block.properties?.title} block={block} />
          </div>
        </div>
      )

    case 'bookmark':
      let title = getTextContent(block.properties?.title)
      if (!title) {
        title = getTextContent(block.properties?.link)
      }

      if (title) {
        if (title.startsWith('http')) {
          try {
            const url = new URL(title)
            title = url.hostname
          } catch (err) {
            // ignore invalid links
          }
        }
      }

      return (
        <div className='notion-row'>
          <components.link
            target='_blank'
            rel='noopener noreferrer'
            className={cs(
              'notion-bookmark',
              block.format?.block_color && `notion-${block.format.block_color}`
            )}
            href={block.properties.link[0][0]}
          >
            <div>
              {title && (
                <div className='notion-bookmark-title'>
                  <Text value={[[title]]} block={block} />
                </div>
              )}

              {block.properties?.description && (
                <div className='notion-bookmark-description'>
                  <Text value={block.properties?.description} block={block} />
                </div>
              )}

              <div className='notion-bookmark-link'>
                {block.format?.bookmark_icon && (
                  <GracefulImage
                    src={block.format?.bookmark_icon}
                    alt={title}
                    loading='lazy'
                  />
                )}

                <div>
                  <Text value={block.properties?.link} block={block} />
                </div>
              </div>
            </div>

            {block.format?.bookmark_cover && (
              <div className='notion-bookmark-image'>
                <GracefulImage
                  src={block.format?.bookmark_cover}
                  alt={getTextContent(block.properties.title)}
                  loading='lazy'
                />
              </div>
            )}
          </components.link>
        </div>
      )

    case 'toggle':
      return (
        <details className='notion-toggle'>
          <summary>
            <Text value={block.properties.title} block={block} />
          </summary>

          <div>{children}</div>
        </details>
      )

    case 'table_of_contents': {
      const page = getBlockParentPage(block, recordMap)
      if (!page) return null

      const toc = getPageTableOfContents(page, recordMap)
      const blockColor = block.format?.block_color

      return (
        <div
          className={cs(
            'notion-table-of-contents',
            blockColor && `notion-${blockColor}`
          )}
        >
          {toc.map((tocItem) => (
            <a
              key={tocItem.id}
              href={`#${uuidToId(tocItem.id)}`}
              className='notion-table-of-contents-item'
            >
              <span
                className='notion-table-of-contents-item-body'
                style={{
                  display: 'inline-block',
                  marginLeft: tocItem.indentLevel * 24
                }}
              >
                {tocItem.text}
              </span>
            </a>
          ))}
        </div>
      )
    }

    case 'to_do':
      const isChecked = block.properties?.checked?.[0]?.[0] === 'Yes'

      return (
        <div className='notion-to-do'>
          <Checkbox isChecked={isChecked} />

          <div
            className={cs(
              'notion-to-do-body',
              isChecked && `notion-to-do-checked`
            )}
          >
            <Text value={block.properties?.title} block={block} />
          </div>
        </div>
      )

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          'Unsupported type ' + (block as any).type,
          JSON.stringify(block, null, 2)
        )
      }

      return <div />
  }

  return null
}
