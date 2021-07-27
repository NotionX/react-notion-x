import React from 'react'
import { BaseContentBlock, Block } from 'notion-types'
import { Asset } from './asset'
import { cs } from '../utils'
import { Text } from './text'

export const AssetWrapper: React.FC<{
  blockId: string
  block: Block
}> = ({ blockId, block }) => {
  const value = block as BaseContentBlock

  return (
    <figure
      className={cs(
        'notion-asset-wrapper',
        `notion-asset-wrapper-${block.type}`,
        value.format?.block_full_width && 'notion-asset-wrapper-full',
        blockId
      )}
    >
      <Asset block={value} />

      {value?.properties?.caption && (
        <figcaption className='notion-asset-caption'>
          <Text value={block.properties.caption} block={block} />
        </figcaption>
      )}
    </figure>
  )
}
