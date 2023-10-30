import * as React from 'react'

import { BaseContentBlock } from 'notion-types'

import { Text } from '../components/text'
import { useNotionContext } from '../context'

export const AFrame: React.FC<{
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

      if (block.type === 'video') {
        if (block_height) {
          style.height = block_height
        } else if (block_aspect_ratio) {
          style.paddingBottom = `${block_aspect_ratio * 100}%`
        } else if (block_preserve_scale) {
          style.objectFit = 'contain'
        }
      } else if (block_aspect_ratio && block.type !== 'image') {
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

      if (block_preserve_scale && block.type !== 'image') {
        style.paddingBottom = '50%'
        style.minHeight = 100
      } else {
        if (block_height && block.type !== 'image') {
          style.height = block_height
        }
      }
    }

    if (block.type === 'image') {
      assetStyle.objectFit = 'cover'
    } else if (block_preserve_scale) {
      assetStyle.objectFit = 'contain'
    }
  }

  const source =
    recordMap.signed_urls?.[block.id] || block.properties?.source?.[0]?.[0]
  let content = null

  if (!source) {
    return null
  }

  let src = block.format?.display_source || source

  if (src) {
    if (block.type === 'gist') {
      if (!src.endsWith('.pibb')) {
        src = `${src}.pibb`
      }

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
