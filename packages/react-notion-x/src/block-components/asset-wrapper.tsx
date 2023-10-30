import * as React from 'react'

import { Block } from 'notion-types'

import { cs } from '../utils'

export const AssetWrapper: React.FC<{
  blockId: string
  block: Block
  children: any
}> = ({ blockId, block, children }) => {
  return (
    <figure
      className={cs(
        'notion-asset-wrapper',
        `notion-asset-wrapper-${block.type}`,
        block.format?.block_full_width && 'notion-asset-wrapper-full',
        blockId
      )}
    >
      {children}
    </figure>
  )
}
