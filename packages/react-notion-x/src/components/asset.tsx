import * as React from 'react'
import dynamic from 'next/dynamic'

import { BaseContentBlock, Block } from '../types'
import { getTextContent } from '../utils'
import { useNotionContext } from '../context'

import { LazyImage } from './lazy-image'

const isServer = typeof window === 'undefined'

const DynamicTweet = dynamic(() =>
  import('react-tweet-embed').then((res) => {
    // console.log('DynamicTweet', res)
    return res.default
  })
) as any
const DynamicPdfDocument: any = dynamic(() =>
  import('react-pdf').then((pdf) => pdf.Document)
)
const DynamicPdfPage: any = dynamic(() =>
  import('react-pdf').then((pdf) => pdf.Page)
)

const types = ['video', 'image', 'embed', 'figma', 'maps', 'tweet', 'pdf']

export const Asset: React.FC<{
  block: BaseContentBlock
}> = ({ block }) => {
  const { recordMap, mapImageUrl } = useNotionContext()

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
        style.paddingBottom = `${block_aspect_ratio * 100}%`
      } else if (block_height) {
        style.height = block_height
      }
    } else {
      if (block_width) {
        style.width = block_width
      }

      if (!block_preserve_scale) {
        if (block_height) {
          style.height = block_height
        }
      }
    }

    if (block_preserve_scale || block.type === 'image') {
      assetStyle.objectFit = 'cover'
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
        <DynamicTweet id={id} />
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

      content = (
        <DynamicPdfDocument file={signedUrl}>
          <DynamicPdfPage pageNumber={1} />
        </DynamicPdfDocument>
      )
    }
  } else if (
    block.type === 'embed' ||
    block.type === 'video' ||
    block.type === 'figma' ||
    block.type === 'maps'
  ) {
    const src = block.format?.display_source ?? source

    if (src) {
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
