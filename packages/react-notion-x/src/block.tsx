import React from 'react'
import throttle from 'lodash.throttle'
import {
  getBlockIcon,
  getTextContent,
  getPageTableOfContents,
  getBlockParentPage,
  uuidToId
} from 'notion-utils'
import * as types from 'notion-types'

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
import { cs, getListNumber, isUrl } from './utils'
import { Text } from './components/text'
import { SyncPointerBlock } from './components/sync-pointer-block'
import { AssetWrapper } from './components/asset-wrapper'

interface BlockProps {
  block: types.Block
  level: number

  className?: string
  bodyClassName?: string

  footer?: React.ReactNode
  pageHeader?: React.ReactNode
  pageFooter?: React.ReactNode
  pageAside?: React.ReactNode
  pageCover?: React.ReactNode

  hideBlockId?: boolean
}

const tocIndentLevelCache: {
  [blockId: string]: number
} = {}

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
    pageAside,
    pageCover,
    hideBlockId
  } = props

  if (!block) {
    return null
  }

  // ugly hack to make viewing raw collection views work properly
  // e.g., 6d886ca87ab94c21a16e3b82b43a57fb
  if (level === 0 && block.type === 'collection_view') {
    ;(block as any).type = 'collection_view_page'
  }

  const blockId = hideBlockId
    ? 'notion-block'
    : `notion-block-${uuidToId(block.id)}`

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

          const toc = getPageTableOfContents(block as types.PageBlock, recordMap)

          const hasToc =
            showTableOfContents && toc.length >= minTableOfContentsItems
          const hasAside = (hasToc || pageAside) && !page_full_width

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
                <PageHeader />

                <div className='notion-page-scroller'>
                  {hasPageCover ? (
                    pageCover ? (
                      pageCover
                    ) : (
                      <LazyImage
                        src={mapImageUrl(page_cover, block)}
                        alt={getTextContent(properties?.title)}
                        className='notion-page-cover'
                        style={{
                          objectPosition: `center ${coverPosition}%`
                        }}
                      />
                    )
                  ) : null}

                  <main
                    className={cs(
                      'notion-page',
                      hasPageCover
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

                    <h1 className='notion-title'>
                      <Text value={properties?.title} block={block} />
                    </h1>

                    {block.type === 'page' &&
                      block.parent_table === 'collection' && (
                        <components.collectionRow block={block} />
                      )}

                    {block.type === 'collection_view_page' && (
                      <components.collection block={block} />
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

              {block.type === 'page' && block.parent_table === 'collection' && (
                <components.collectionRow block={block} />
              )}

              {block.type === 'collection_view_page' && (
                <components.collection block={block} />
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
              blockColor && `notion-${blockColor}`,
              blockId
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

      // we use a cache here because constructing the ToC is non-trivial
      let indentLevel = tocIndentLevelCache[block.id]
      let indentLevelClass: string

      if (indentLevel === undefined) {
        const page = getBlockParentPage(block, recordMap)

        if (page) {
          const toc = getPageTableOfContents(page, recordMap)
          const tocItem = toc.find((tocItem) => tocItem.id === block.id)

          if (tocItem) {
            indentLevel = tocItem.indentLevel
            tocIndentLevelCache[block.id] = indentLevel
          }
        }
      }

      if (indentLevel !== undefined) {
        indentLevelClass = `notion-h-indent-${indentLevel}`
      }

      const isH1 = block.type === 'header'
      const isH2 = block.type === 'sub_header'
      const isH3 = block.type === 'sub_sub_header'

      const classNameStr = cs(
        isH1 && 'notion-h notion-h1',
        isH2 && 'notion-h notion-h2',
        isH3 && 'notion-h notion-h3',
        blockColor && `notion-${blockColor}`,
        indentLevelClass,
        blockId
      )

      const innerHeader = (
        <span>
          <div id={id} className='notion-header-anchor' />

          <a className='notion-hash-link' href={`#${id}`} title={title}>
            <LinkIcon />
          </a>

          <span className='notion-h-title'>
            <Text value={block.properties.title} block={block} />
          </span>
        </span>
      )

      //page title takes the h1 so all header blocks are greater
      if (isH1) {
        return (
          <h2 className={classNameStr} data-id={id}>
            {innerHeader}
          </h2>
        )
      } else if (isH2) {
        return (
          <h3 className={classNameStr} data-id={id}>
            {innerHeader}
          </h3>
        )
      } else {
        return (
          <h4 className={classNameStr} data-id={id}>
            {innerHeader}
          </h4>
        )
      }
    }

    case 'divider':
      return <hr className={cs('notion-hr', blockId)} />

    case 'text':
      if (!block.properties && !block.content?.length) {
        return <div className={cs('notion-blank', blockId)}>&nbsp;</div>
      }

      const blockColor = block.format?.block_color

      return (
        <div
          className={cs(
            'notion-text',
            blockColor && `notion-${blockColor}`,
            blockId
          )}
        >
          {block.properties?.title && (
            <Text value={block.properties.title} block={block} />
          )}

          {children && <div className='notion-text-children'>{children}</div>}
        </div>
      )

    case 'bulleted_list':
    // fallthrough
    case 'numbered_list':
      const wrapList = (content: React.ReactNode, start?: number) =>
        block.type === 'bulleted_list' ? (
          <ul className={cs('notion-list', 'notion-list-disc', blockId)}>
            {content}
          </ul>
        ) : (
          <ol
            start={start}
            className={cs('notion-list', 'notion-list-numbered', blockId)}
          >
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
    case 'typeform':
    // fallthrough
    case 'codepen':
    // fallthrough
    case 'excalidraw':
    // fallthrough
    case 'image':
    // fallthrough
    case 'gist':
    // fallthrough
    case 'embed':
    // fallthrough
    case 'video':
      return <AssetWrapper blockId={blockId} block={block} />

    case 'drive':
      const properties = block.format?.drive_properties
      if (!properties) {
        //check if this drive actually needs to be embeded ex. google sheets.
        if (block.format?.display_source) {
          return <AssetWrapper blockId={blockId} block={block} />
        }
      }

      return (
        <GoogleDrive
          block={block as types.GoogleDriveBlock}
          className={blockId}
        />
      )

    case 'audio':
      return <Audio block={block as types.AudioBlock} className={blockId} />

    case 'file':
      return <File block={block as types.FileBlock} className={blockId} />

    case 'equation':
      const math = block.properties.title[0][0]
      if (!math) return null
      return <Equation math={math} block className={blockId} />

    case 'code': {
      if (block.properties.title) {
        const content = block.properties.title[0][0]
        const language = block.properties.language
          ? block.properties.language[0][0]
          : ''
        const caption = block.properties.caption

        // TODO: add className
        return (
          <>
            <components.code
              key={block.id}
              language={language || ''}
              code={content}
            />
            {caption && (
              <figcaption className='notion-asset-caption'>
                <Text value={caption} block={block} />
              </figcaption>
            )}
          </>
        )
      }
      break
    }

    case 'column_list':
      return <div className={cs('notion-row', blockId)}>{children}</div>

    case 'column':
      // note: notion uses 46px
      const spacerWidth = `min(32px, 4vw)`
      const ratio = block.format?.column_ratio || 0.5
      const parent = recordMap.block[block.parent_id]?.value
      const columns =
        parent?.content?.length || Math.max(2, Math.ceil(1.0 / ratio))

      const width = `calc((100% - (${
        columns - 1
      } * ${spacerWidth})) * ${ratio})`
      const style = { width }

      return (
        <>
          <div className={cs('notion-column', blockId)} style={style}>
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
          className={cs(
            'notion-quote',
            blockColor && `notion-${blockColor}`,
            blockId
          )}
        >
          <Text value={block.properties.title} block={block} />
        </blockquote>
      )
    }

    case 'collection_view':
      return <components.collection block={block} className={blockId} />

    case 'callout':
      return (
        <div
          className={cs(
            'notion-callout',
            block.format?.block_color &&
              `notion-${block.format?.block_color}_co`,
            blockId
          )}
        >
          <PageIcon block={block} />

          <div className='notion-callout-text'>
            <Text value={block.properties?.title} block={block} />
            {children}
          </div>
        </div>
      )

    case 'bookmark':
      if (!block.properties) return null

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
              block.format?.block_color && `notion-${block.format.block_color}`,
              blockId
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
                  alt={getTextContent(block.properties?.title)}
                  loading='lazy'
                />
              </div>
            )}
          </components.link>
        </div>
      )

    case 'toggle':
      return (
        <details className={cs('notion-toggle', blockId)}>
          <summary>
            <Text value={block.properties?.title} block={block} />
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
            blockColor && `notion-${blockColor}`,
            blockId
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
        <div className={cs('notion-to-do', blockId)}>
          <div className='notion-to-do-item'>
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

          <div className='notion-to-do-children'>{children}</div>
        </div>
      )

    case 'transclusion_container':
      return <div className={cs('notion-sync-block', blockId)}>{children}</div>

    case 'transclusion_reference':
      return <SyncPointerBlock block={block} level={level + 1} {...props} />

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
