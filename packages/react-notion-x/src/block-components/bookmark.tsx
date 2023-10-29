import * as React from 'react'

import { Block } from 'notion-types'
import { getTextContent } from 'notion-utils'

import { LazyImage } from '../components/lazy-image'
import { Text } from '../components/text'
import { useNotionContext } from '../context'
import { cs } from '../utils'

export const Bookmark: React.FC<{
  blockId: string
  block: Block
}> = ({ blockId, block }) => {
  const ctx = useNotionContext()
  const { components, mapImageUrl } = ctx

  if (!block.properties) return null

  const link = block.properties.link
  if (!link || !link[0]?.[0]) return null

  let title = getTextContent(block.properties.title)
  if (!title) {
    title = getTextContent(link)
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
      <components.Link
        target='_blank'
        rel='noopener noreferrer'
        className={cs(
          'notion-bookmark',
          block.format?.block_color && `notion-${block.format.block_color}`,
          blockId
        )}
        href={link[0][0]}
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
              <div className='notion-bookmark-link-icon'>
                <LazyImage
                  src={mapImageUrl(block.format?.bookmark_icon, block)}
                  alt={title}
                />
              </div>
            )}

            <div className='notion-bookmark-link-text'>
              <Text value={link} block={block} />
            </div>
          </div>
        </div>

        {block.format?.bookmark_cover && (
          <div className='notion-bookmark-image'>
            <LazyImage
              src={mapImageUrl(block.format?.bookmark_cover, block)}
              alt={getTextContent(block.properties?.title)}
              style={{
                objectFit: 'cover'
              }}
            />
          </div>
        )}
      </components.Link>
    </div>
  )
}
