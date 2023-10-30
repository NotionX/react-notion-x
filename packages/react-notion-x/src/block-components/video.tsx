import * as React from 'react'

import { BaseContentBlock } from 'notion-types'

import { LiteYouTubeEmbed } from '../components/lite-youtube-embed'
import { Text } from '../components/text'
import { useNotionContext } from '../context'
import { getYoutubeId } from '../utils'

export const Video: React.FC<{
  block: BaseContentBlock
}> = ({ block }) => {
  const { recordMap } = useNotionContext()

  if (!block) {
    return null
  }

  const style: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: '100%',
    flexDirection: 'column'
  }

  const assetStyle: React.CSSProperties = {}

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

      if (block_height) {
        style.height = block_height
      } else if (block_aspect_ratio) {
        style.paddingBottom = `${block_aspect_ratio * 100}%`
      } else if (block_preserve_scale) {
        style.objectFit = 'contain'
      }
    } else {
      switch (block.format?.block_alignment) {
        case 'center': {
          style.alignSelf = 'center'
          break
        }
        case 'left': {
          style.alignSelf = 'start'
          break
        }
        case 'right': {
          style.alignSelf = 'end'
          break
        }
      }

      if (block_width) {
        style.width = block_width
      }

      style.height = block_height
    }

    assetStyle.objectFit = 'contain'
  }

  const source =
    recordMap.signed_urls?.[block.id] || block.properties?.source?.[0]?.[0]
  let content = null

  if (!source) {
    return null
  }

  if (
    source &&
    source.indexOf('youtube') < 0 &&
    source.indexOf('youtu.be') < 0 &&
    source.indexOf('vimeo') < 0 &&
    source.indexOf('wistia') < 0 &&
    source.indexOf('loom') < 0 &&
    source.indexOf('videoask') < 0 &&
    source.indexOf('getcloudapp') < 0
  ) {
    style.paddingBottom = undefined

    content = (
      <video
        playsInline
        controls
        preload='metadata'
        style={assetStyle}
        src={source}
        title={block.type}
      />
    )
  } else {
    const src = block.format?.display_source || source
    const youtubeVideoId: string | null = getYoutubeId(src)

    if (src && youtubeVideoId) {
      content = (
        <LiteYouTubeEmbed
          id={youtubeVideoId}
          style={assetStyle}
          className='notion-asset-object-fit'
        />
      )
    } else {
      // Loom handle
      let src = block.format?.display_source || source

      if (src) {
        src += block.type === 'typeform' ? '&disable-auto-focus=true' : ''

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
            scrolling='auto'
          />
        )
      }
    }
  }

  const children = (
    <>
      {block?.properties?.caption && (
        <figcaption className='notion-asset-caption'>
          <Text value={block.properties.caption} block={block} />
        </figcaption>
      )}
    </>
  )

  return (
    <>
      <div style={style}>{content}</div>

      {children}
    </>
  )
}
