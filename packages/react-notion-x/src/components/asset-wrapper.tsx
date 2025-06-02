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

interface PageInfo {
  type: 'page'
  id: string
  url: string
}

interface ExternalInfo {
  type: 'external'
  url: string
}

type URLInfo = PageInfo | ExternalInfo | null

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
  const linkToUse = imageHyperlink || caption || ''

  const urlInfo = getURLInfo(value, linkToUse)

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
    const isExternalLink =
      urlHostName && urlHostName !== rootDomain && !caption?.startsWith('/')

    const href =
      urlInfo.type === 'page' && urlInfo.id
        ? mapPageUrl(urlInfo.id)
        : urlInfo.url

    return (
      <components.PageLink
        style={urlStyle}
        href={href}
        target={isExternalLink ? 'blank_' : null}
      >
        {figure}
      </components.PageLink>
    )
  }

  return figure
}
function getURLInfo(block: BaseContentBlock, link?: string): URLInfo {
  if (!link || block.type !== 'image') {
    return null
  }

  const id = parsePageId(link, { uuid: true })
  const isPage = link.charAt(0) === '/' && id

  if (isPage) {
    return {
      type: 'page' as const,
      id,
      url: link
    }
  }

  if (isValidURL(link)) {
    return {
      type: 'external' as const,
      url: link
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
