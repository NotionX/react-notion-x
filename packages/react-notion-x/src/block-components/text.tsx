import * as React from 'react'

import { Block } from 'notion-types'

import { Text } from '../components/text'
import { cs } from '../utils'

export const TextBlock: React.FC<{
  blockId: string
  block: Block
  children?: React.ReactNode
}> = ({ blockId, block, children }) => {
  if (!block.properties && !block.content?.length) {
    return <div className={cs('notion-blank', blockId)}>&nbsp;</div>
  }

  const blockColor = block.format?.block_color

  return (
    <div
      className={cs(
        'notion-text',
        blockColor && `notion-${blockColor}`,
        blockId
      )}
    >
      {block.properties?.title && (
        <Text value={block.properties.title} block={block} />
      )}

      {children && <div className='notion-text-children'>{children}</div>}
    </div>
  )
}
