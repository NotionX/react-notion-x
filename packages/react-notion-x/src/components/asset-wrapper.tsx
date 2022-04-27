import * as React from 'react'
import { BaseContentBlock, Block } from 'notion-types'
import { Asset } from './asset'
import { cs } from '../utils'
import { Text } from './text'
import { useNotionContext } from '..'
import { parsePageId } from 'notion-utils'

const urlStyle = { width: '100%' }

export const AssetWrapper: React.FC<{
  blockId: string
  block: Block
}> = ({ blockId, block }) => {
  const value = block as BaseContentBlock
  const { components, mapPageUrl, rootDomain } = useNotionContext()

  let isURL = false
  if (block.type === 'image') {
    const caption: string = value?.properties?.caption?.[0]?.[0]
    if (caption) {
      const id = parsePageId(caption, { uuid: true })

      const isPage = caption.charAt(0) === '/' && id
      if (isPage || isValidURL(caption)) {
        isURL = true
      }
    }
  }

  const figure = (
    <figure
      className={cs(
        'notion-asset-wrapper',
        `notion-asset-wrapper-${block.type}`,
        value.format?.block_full_width && 'notion-asset-wrapper-full',
        blockId
      )}
    >
      <Asset block={value} zoomable={!isURL}>
        {value?.properties?.caption && !isURL && (
          <figcaption className='notion-asset-caption'>
            <Text value={value.properties.caption} block={block} />
          </figcaption>
        )}
      </Asset>
    </figure>
  )

  // allows for an image to be a link
  if (isURL) {
    const caption: string = value?.properties?.caption[0][0]
    const id = parsePageId(caption, { uuid: true })
    const isPage = caption.charAt(0) === '/' && id
    const captionHostname = extractHostname(caption)

    return (
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
        {figure}
      </components.PageLink>
    )
  }

  return figure
}

function isValidURL(str) {
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

function extractHostname(url) {
  try {
    const hostname = new URL(url).hostname
    return hostname
  } catch (err) {
    return ''
  }
}
