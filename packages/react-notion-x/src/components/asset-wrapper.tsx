import type * as React from 'react'
import {
  type BaseContentBlock,
  type Block,
  type ImageBlock
} from 'notion-types'
import { parsePageId } from 'notion-utils'

import { useNotionContext } from '..'
import { cs } from '../utils'
import { Asset } from './asset'
import { Text } from './text'

const urlStyle = { width: '100%' }

export function AssetWrapper({
  blockId,
  block
}: {
  blockId: string
  block: Block
}) {
  const value = block as BaseContentBlock
  const { components, mapPageUrl, rootDomain, zoom } = useNotionContext()

  const caption = value.properties?.caption?.[0]?.[0]
  const imageHyperlink = (value as ImageBlock).format?.image_hyperlink

  const availableLinks = [imageHyperlink, caption].filter(Boolean) as string[]
  const urlInfo = getURL(value, availableLinks)

  const figure = (
    <figure
      className={cs(
        'notion-asset-wrapper',
        `notion-asset-wrapper-${block.type}`,
        value.format?.block_full_width && 'notion-asset-wrapper-full',
        blockId
      )}
    >
      <Asset block={value} zoomable={zoom && !urlInfo}>
        {value?.properties?.caption && (
          <figcaption className='notion-asset-caption'>
            <Text value={value.properties.caption} block={block} />
          </figcaption>
        )}
      </Asset>
    </figure>
  )

  // allows for an image to be a link
  if (urlInfo?.url) {
    const urlHostName = extractHostname(urlInfo.url)
    return (
      <components.PageLink
        style={urlStyle}
        href={urlInfo.type === 'page' ? mapPageUrl(urlInfo.url) : urlInfo.url}
        target={
          urlHostName && urlHostName !== rootDomain && !caption?.startsWith('/')
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

function getURL(
  block: BaseContentBlock,
  availableLinks: string[]
): {
  id?: string
  type: 'page' | 'external'
  url: string
} | null {
  if (block.type !== 'image') {
    return null
  }

  for (const link of availableLinks) {
    if (!link) continue

    const id = parsePageId(link, { uuid: true })
    const isPage = link.charAt(0) === '/' && id

    if (isPage || isValidURL(link)) {
      return {
        id: id ?? undefined,
        type: isValidURL(link) ? 'external' : 'page',
        url: link
      }
    }
  }
  return null
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

function extractHostname(url?: string) {
  try {
    const hostname = new URL(url!).hostname
    return hostname
  } catch {
    return ''
  }
}
