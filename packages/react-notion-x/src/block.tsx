import * as React from 'react'
import cs from 'classnames'
import dynamic from 'next/dynamic'

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
  classNames,
  getTextContent,
  getListNumber,
  getPageTableOfContents,
  getBlockParentPage,
  uuidToId
} from './utils'
import { Text } from './components/text'

// load heavier components asynchronously
const Code = dynamic(() => import('./components/code'))
const Collection = dynamic(() => import('./components/collection'))
const CollectionRow = dynamic(() => import('./components/collection-row'))

interface BlockProps {
  block: types.Block
  level: number

  className?: string
  bodyClassName?: string
  footer?: React.ReactNode
}

export const Block: React.FC<BlockProps> = (props) => {
  const {
    components,
    fullPage,
    darkMode,
    recordMap,
    mapPageUrl,
    mapImageUrl
  } = useNotionContext()

  const { block, children, level, className, bodyClassName, footer } = props

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
          page_icon,
          page_cover,
          page_cover_position,
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

          return (
            <div
              className={cs(
                'notion',
                'notion-app',
                darkMode && 'notion-dark',
                className
              )}
            >
              <div className='notion-cursor-listener'>
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
                      className={classNames(
                        'notion-page',
                        !page_cover && 'notion-page-offset',
                        page_full_width && 'notion-full-width',
                        page_small_text && 'notion-small-text',
                        bodyClassName
                      )}
                    >
                      {page_icon && (
                        <PageIcon
                          className={
                            page_cover ? 'notion-page-icon-offset' : undefined
                          }
                          block={block}
                          large
                        />
                      )}

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

                      {children}
                    </main>

                    {footer}
                  </div>
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
              {block.type === 'page' && block.parent_table === 'collection' && (
                <CollectionRow block={block} />
              )}

              {block.type === 'collection_view_page' && (
                <Collection block={block} />
              )}

              {children}
            </main>
          )
        }
      } else {
        const blockColor = block.format?.block_color

        return (
          <components.pageLink
            className={classNames(
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
          className={classNames(
            block.type === 'header' && 'notion-h1',
            block.type === 'sub_header' && 'notion-h2',
            block.type === 'sub_sub_header' && 'notion-h3',
            blockColor && `notion-${blockColor}`
          )}
          id={id}
        >
          <components.link
            className='notion-hash-link'
            href={`#${id}`}
            title={title}
          >
            <LinkIcon />
          </components.link>

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
          className={classNames(
            'notion-text',
            blockColor && `notion-${blockColor}`
          )}
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
    case 'embed':
    // fallthrough
    case 'video':
      const value = block as types.BaseContentBlock

      return (
        <figure
          className={cs(
            'notion-asset-wrapper',
            `notion-asset-wrapper-${block.type}`,
            block?.format?.block_full_width && 'notion-asset-wrapper-full'
          )}
        >
          <Asset block={block} />

          {value.properties.caption && (
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
      const spacerMaxWidth = 46
      const spacerWidth = `min(${spacerMaxWidth}px, 4vw)`
      const ratio = block.format?.column_ratio || 0.5
      const columns = Math.max(2, Math.ceil(1.0 / ratio))

      const width = `calc((100% - (${
        columns - 1
      } * ${spacerWidth}px)) * ${ratio})`

      return (
        <>
          <div className='notion-column' style={{ width }}>
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
          className={classNames(
            'notion-quote',
            blockColor && `notion-${blockColor}`
          )}
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
          className={classNames(
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
            className={classNames(
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
          className={classNames(
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
            className={classNames(
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
