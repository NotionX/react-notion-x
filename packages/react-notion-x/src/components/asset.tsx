import React from 'react'
import { BaseContentBlock, Block } from 'notion-types'
import { getTextContent } from 'notion-utils'

import { useNotionContext } from '../context'
import { LazyImage } from './lazy-image'

const isServer = typeof window === 'undefined'

const types = [
  'video',
  'image',
  'embed',
  'figma',
  'typeform',
  'excalidraw',
  'maps',
  'tweet',
  'pdf',
  'gist',
  'codepen',
  'drive'
]

export const Asset: React.FC<{
  block: BaseContentBlock
}> = ({ block }) => {
  const { recordMap, mapImageUrl, components } = useNotionContext()

  if (!block || !types.includes(block.type)) {
    return null
  }

  const style: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: '100%'
  }

  const assetStyle: React.CSSProperties = {}
  // console.log('asset', block)

  if (block.format) {
    const {
      block_aspect_ratio,
      block_height,
      block_width,
      block_full_width,
      block_page_width,
      block_preserve_scale
    } = block.format

    if (block_full_width || block_page_width) {
      if (block_full_width) {
        style.width = '100vw'
      } else {
        style.width = '100%'
      }

      if (block_aspect_ratio && block.type !== 'image') {
        // console.log(block.type, block)
        style.paddingBottom = `${block_aspect_ratio * 100}%`
      } else if (block_height) {
        style.height = block_height
      } else if (block_preserve_scale) {
        if (block.type === 'image') {
          style.height = '100%'
        } else {
          // TODO: this is just a guess
          style.paddingBottom = '75%'
          style.minHeight = 100
        }
      }
    } else {
      if (block_width) {
        style.width = block_width
      }

      if (block_preserve_scale && block.type !== 'image') {
        style.paddingBottom = '50%'
        style.minHeight = 100
      } else {
        if (block_height && block.type !== 'image') {
          style.height = block_height
        }
      }
    }

    if (block_preserve_scale || block.type === 'image') {
      assetStyle.objectFit = 'contain'
    }
  }

  const source = block.properties?.source?.[0]?.[0]
  let content = null

  if (block.type === 'tweet') {
    const src = source
    if (!src) return null

    const id = src.split('?')[0].split('/').pop()
    if (!id) return null

    content = (
      <div
        style={{
          ...assetStyle,
          maxWidth: 420,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <components.tweet id={id} />
      </div>
    )
  } else if (block.type === 'pdf') {
    style.overflow = 'auto'
    style.padding = '8px 16px'
    style.background = 'rgb(226, 226, 226)'

    if (!isServer) {
      const signedUrl = recordMap.signed_urls?.[block.id]
      if (!signedUrl) return null
      console.log('pdf', block, signedUrl)

      content = <components.pdf file={signedUrl} />
    }
  } else if (
    block.type === 'embed' ||
    block.type === 'video' ||
    block.type === 'figma' ||
    block.type === 'typeform' ||
    block.type === 'gist' ||
    block.type === 'maps' ||
    block.type === 'excalidraw' ||
    block.type === 'codepen' ||
    block.type === 'drive'
  ) {
    const signedUrl = recordMap.signed_urls[block.id]

    if (
      block.type === 'video' &&
      signedUrl &&
      signedUrl.indexOf('youtube') < 0 &&
      signedUrl.indexOf('youtu.be') < 0 &&
      signedUrl.indexOf('vimeo') < 0 &&
      signedUrl.indexOf('wistia') < 0 &&
      signedUrl.indexOf('loom') < 0 &&
      signedUrl.indexOf('videoask') < 0 &&
      signedUrl.indexOf('getcloudapp') < 0
    ) {
      content = (
        <video
          playsInline
          controls
          preload='metadata'
          style={assetStyle}
          src={signedUrl}
          title={block.type}
        />
      )
    } else {
      let src = block.format?.display_source ?? source

      if (src) {
        if (block.type === 'gist' && !src.endsWith('.pibb')) {
          src = `${src}.pibb`
        }

        if (block.type === 'gist') {
          assetStyle.width = '100%'
          style.paddingBottom = '50%'

          // TODO: GitHub gists do not resize their height properly
          content = (
            <iframe
              style={assetStyle}
              className='notion-asset-object-fit'
              src={src}
              title='GitHub Gist'
              frameBorder='0'
              // TODO: is this sandbox necessary?
              // sandbox='allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin'
              // this is important for perf but react's TS definitions don't seem to like it
              loading='lazy'
              scrolling='auto'
            />
          )
        } else {
          content = (
            <iframe
              className='notion-asset-object-fit'
              style={assetStyle}
              src={src}
              title={`iframe ${block.type}`}
              frameBorder='0'
              // TODO: is this sandbox necessary?
              // sandbox='allow-scripts allow-popups allow-top-navigation-by-user-activation allow-forms allow-same-origin'
              allowFullScreen
              // this is important for perf but react's TS definitions don't seem to like it
              loading='lazy'
            />
          )
        }
      }
    }
  } else if (block.type === 'image') {
    // console.log('image', block)

    const src = mapImageUrl(source, block as Block)
    const caption = getTextContent(block.properties?.caption)
    const alt = caption || 'notion image'

    content = (
      <LazyImage
        src={src}
        alt={alt}
        style={assetStyle}
        zoomable={true}
        height={style.height as number}
      />
    )
  }

  return <div style={style}>{content}</div>
}
