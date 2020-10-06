import * as React from 'react'

import * as types from '../types'
import { Property } from './property'
import { cs, getTextContent } from '../utils'
import { useNotionContext, dummyLink, NotionContextProvider } from '../context'
import { LazyImage } from './lazy-image'

export const CollectionCard: React.FC<types.CollectionCardProps> = ({
  collection,
  block,
  cover,
  coverSize,
  coverAspect,
  properties,
  className,
  ...rest
}) => {
  const ctx = useNotionContext()
  const { components, recordMap, mapPageUrl, mapImageUrl } = ctx
  let coverContent = null

  const { page_cover_position = 0.5 } = block.format || {}
  const coverPosition = (1 - page_cover_position) * 100

  if (cover?.type === 'page_content') {
    const contentBlockId = block.content?.find((blockId) => {
      const block = recordMap.block[blockId]?.value

      if (block?.type === 'image') {
        return true
      }
    })

    if (contentBlockId) {
      const contentBlock = recordMap.block[contentBlockId]
        ?.value as types.ImageBlock

      const source =
        contentBlock.properties?.source?.[0]?.[0] ??
        contentBlock.format?.display_source

      if (source) {
        const src = mapImageUrl(source, contentBlock)
        const caption = contentBlock.properties?.caption?.[0]?.[0]

        coverContent = (
          <LazyImage
            src={src}
            alt={caption || 'notion image'}
            style={{
              objectFit: coverAspect
            }}
          />
        )
      }
    }

    if (!coverContent) {
      coverContent = <div className='notion-collection-card-cover-empty' />
    }
  } else if (cover?.type === 'page_cover') {
    const { page_cover } = block.format || {}

    if (page_cover) {
      const coverPosition = (1 - page_cover_position) * 100

      coverContent = (
        <LazyImage
          src={mapImageUrl(page_cover, block)}
          alt={getTextContent(block.properties?.title)}
          style={{
            objectFit: coverAspect,
            objectPosition: `center ${coverPosition}%`
          }}
        />
      )
    }
  } else if (cover?.type === 'property') {
    const { property } = cover
    const schema = collection.schema[property]
    const data = block.properties?.[property]

    if (schema) {
      if (schema.type === 'file') {
        const files = data
          .filter((v) => v.length === 2)
          .map((f) => f.flat().flat())
        const file = files[0]

        if (file) {
          coverContent = (
            <span className={`notion-property-${schema.type}`}>
              <LazyImage
                alt={file[0] as string}
                src={mapImageUrl(file[2] as string, block)}
                style={{
                  objectFit: coverAspect,
                  objectPosition: `center ${coverPosition}%`
                }}
              />
            </span>
          )
        }
      } else {
        coverContent = <Property schema={schema} data={data} />
      }
    }
  }

  return (
    <NotionContextProvider
      {...ctx}
      components={{
        ...ctx.components,
        // Disable <a> tabs in all child components so we don't create invalid DOM
        // trees with stacked <a> tags.
        link: dummyLink,
        pageLink: dummyLink
      }}
    >
      <components.pageLink
        className={cs(
          'notion-collection-card',
          `notion-collection-card-size-${coverSize}`,
          className
        )}
        href={mapPageUrl(block.id)}
        {...rest}
      >
        {(coverContent || cover?.type !== 'none') && (
          <div className='notion-collection-card-cover'>{coverContent}</div>
        )}

        <div className='notion-collection-card-body'>
          <div className='notion-collection-card-property'>
            <Property
              schema={collection.schema.title}
              data={block?.properties?.title}
              block={block}
              collection={collection}
            />
          </div>

          {properties
            ?.filter(
              (p) =>
                p.visible &&
                p.property !== 'title' &&
                collection.schema[p.property]
            )
            .map((p) => {
              const schema = collection.schema[p.property]
              const data = block.properties[p.property]

              return (
                <div
                  className='notion-collection-card-property'
                  key={p.property}
                >
                  <Property
                    schema={schema}
                    data={data}
                    block={block}
                    collection={collection}
                    inline
                  />
                </div>
              )
            })}
        </div>
      </components.pageLink>
    </NotionContextProvider>
  )
}
