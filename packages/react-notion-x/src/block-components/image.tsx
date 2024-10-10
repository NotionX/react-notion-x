import * as React from 'react'

import { BaseContentBlock, Block } from 'notion-types'
import { getTextContent, parsePageId } from 'notion-utils'

import { LazyImage } from '../components/lazy-image'
import { Text } from '../components/text'
import { useNotionContext } from '../context'

const urlStyle = { width: '100%' }

export const Image: React.FC<{
  block: BaseContentBlock
  zoomable?: boolean
}> = ({ block, zoomable = true }) => {
  const { recordMap, mapImageUrl, rootDomain, components, mapPageUrl } =
    useNotionContext()

  if (!block) {
    return null
  }

  let isURL = false
  const _caption: string = block?.properties?.caption?.[0]?.[0]

  if (_caption) {
    const id = parsePageId(_caption, { uuid: true })

    const isPage = _caption.charAt(0) === '/' && id
    if (isPage || isValidURL(_caption)) {
      isURL = true
    }
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
      } else if (block_preserve_scale) {
        style.height = '100%'
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
    }

    assetStyle.objectFit = 'cover'
  }

  let source =
    recordMap.signed_urls?.[block.id] || block.properties?.source?.[0]?.[0]
  let content = null

  if (!source) {
    return null
  }

  // console.log('image', block)
  // kind of a hack for now. New file.notion.so images aren't signed correctly
  if (source.includes('file.notion.so')) {
    source = block.properties?.source?.[0]?.[0]
  }
  const src = mapImageUrl(source, block as Block)
  const caption = getTextContent(block.properties?.caption)
  const alt = caption || 'notion image'

  content = (
    <LazyImage
      src={src}
      alt={alt}
      zoomable={zoomable && !isURL}
      height={style.height as number}
      style={assetStyle}
    />
  )

  let children = (
    <>
      {block?.properties?.caption && (
        <figcaption className='notion-asset-caption'>
          <Text value={block.properties.caption} block={block as any} />
        </figcaption>
      )}
    </>
  )

  if (isURL) {
    const caption: string = block?.properties?.caption[0][0]
    const id = parsePageId(caption, { uuid: true })
    const isPage = caption.charAt(0) === '/' && id
    const captionHostname = extractHostname(caption)

    children = (
      <components.PageLink
        style={urlStyle}
        href={isPage ? mapPageUrl(id) : caption}
        target={
          captionHostname &&
          captionHostname !== rootDomain &&
          !caption.startsWith('/')
            ? 'blank_'
            : null
        }
      >
        {children}
      </components.PageLink>
    )
  }
  const figure = (
    <div style={style}>
      {content}
      {children}
    </div>
  )

  return figure
}

function isValidURL(str: string) {
  // TODO: replace this with a more well-tested package
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  )
  return !!pattern.test(str)
}

function extractHostname(url: string) {
  try {
    const hostname = new URL(url).hostname
    return hostname
  } catch (err) {
    return ''
  }
}
