import type React from 'react'
import { type ImageBlock } from 'notion-types'
import { getTextContent } from 'notion-utils'

import { LazyImage } from '../components/lazy-image'
import { dummyLink, NotionContextProvider, useNotionContext } from '../context'
import { type CollectionCardProps } from '../types'
import { cs } from '../utils'
import { Property } from './property'

export function CollectionCard({
  collection,
  block,
  cover,
  coverSize,
  coverAspect,
  properties,
  className,
  ...rest
}: CollectionCardProps) {
  const ctx = useNotionContext()
  const {
    components,
    recordMap,
    mapPageUrl,
    mapImageUrl,
    isLinkCollectionToUrlProperty
  } = ctx
  let coverContent = null

  const { page_cover_position = 0.5, card_cover_position = 0.5 } =
    block.format || ({} as any)
  const coverPosition = (1 - page_cover_position) * 100
  const cardCoverPosition = (1 - card_cover_position) * 100

  if (cover?.type === 'page_content') {
    const contentBlockId = block.content?.find((blockId) => {
      const block = recordMap.block[blockId]?.value

      return block?.type === 'image'
    })

    if (contentBlockId) {
      const contentBlock = recordMap.block[contentBlockId]?.value as ImageBlock

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
              objectFit: coverAspect,
              objectPosition: `center ${cardCoverPosition}%`
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
    if (!property) return null

    const schema = collection.schema[property]
    const data = block.properties?.[property as keyof typeof block.properties]

    if (schema && data) {
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
        coverContent = (
          <Property propertyId={property} schema={schema} data={data} />
        )
      }
    }
  }

  let linkProperties: any[] = []
  // check if a visible property has a url and we settings are for linking to it for the card
  if (isLinkCollectionToUrlProperty && properties) {
    linkProperties = properties
      .filter(
        (p) =>
          p.visible && p.property !== 'title' && collection.schema[p.property]
      )
      .filter((p) => {
        if (!block.properties) return false
        const schema = collection.schema[p.property]

        return schema?.type === 'url'
      })
      .map((p) => {
        return block.properties?.[p.property as keyof typeof block.properties]
      })
      .filter((p) => p?.[0])
  }

  let url = null
  if (
    linkProperties &&
    linkProperties.length > 0 &&
    linkProperties[0].length > 0 &&
    linkProperties[0][0].length > 0
  ) {
    url = linkProperties[0][0][0]
  }

  const innerCard = (
    <>
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
            if (!block.properties || !p.property) return null
            const schema = collection.schema[p.property]
            const data =
              block.properties[p.property as keyof typeof block.properties]

            return (
              <div className='notion-collection-card-property' key={p.property}>
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
    </>
  )

  return (
    <NotionContextProvider
      {...ctx}
      components={{
        ...ctx.components,
        // Disable <a> tabs in all child components so we don't create invalid DOM
        // trees with stacked <a> tags.
        Link: (props: any) => {
          return (
            <form action={props.href} target='_blank'>
              <input
                type='submit'
                value={props?.children?.props?.children ?? props.href}
                className='nested-form-link notion-link'
              />
            </form>
          )
        },
        PageLink: dummyLink
      }}
    >
      {isLinkCollectionToUrlProperty && url ? (
        <components.Link
          className={cs(
            'notion-collection-card',
            `notion-collection-card-size-${coverSize}`,
            className
          )}
          href={url}
          {...rest}
        >
          {innerCard}
        </components.Link>
      ) : (
        <components.PageLink
          className={cs(
            'notion-collection-card',
            `notion-collection-card-size-${coverSize}`,
            className
          )}
          href={mapPageUrl(block.id)}
          {...rest}
        >
          {innerCard}
        </components.PageLink>
      )}
    </NotionContextProvider>
  )
}
