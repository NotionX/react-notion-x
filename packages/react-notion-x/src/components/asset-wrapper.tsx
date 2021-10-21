import React from 'react'
import { BaseContentBlock, Block } from 'notion-types'
import { Asset } from './asset'
import { cs } from '../utils'
import { Text } from './text'
import { useNotionContext } from '..'
import { parsePageId } from 'notion-utils'

export const AssetWrapper: React.FC<{
  blockId: string
  block: Block
}> = ({ blockId, block }) => {
  const value = block as BaseContentBlock
  const { components, mapPageUrl } = useNotionContext()

  let isURL = false
  if (value?.properties?.caption?.length > 0) {
    const caption: string = value?.properties?.caption[0][0]
    const id = parsePageId(caption, { uuid: true })

    const isPage = caption.charAt(0) === '/' && id
    if ((block.type == 'image' && validURL(caption)) || isPage) {
      isURL = true
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
      <Asset block={value}>
        {value?.properties?.caption && !isURL && (
          <figcaption className='notion-asset-caption'>
            <Text value={value.properties.caption} block={block} />
          </figcaption>
        )}
      </Asset>
    </figure>
  )

  //allows for an image to be a link
  if (isURL) {
    const caption: string = value?.properties?.caption[0][0]
    const id = parsePageId(caption, { uuid: true })
    const isPage = caption.charAt(0) === '/' && id
    return (
      <components.pageLink
        style={{ width: '100%' }}
        href={isPage ? mapPageUrl(id) : caption}
      >
        {figure}
      </components.pageLink>
    )
  }

  return <>{figure}</>
}

function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}
