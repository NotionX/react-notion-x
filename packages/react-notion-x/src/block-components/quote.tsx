import * as React from 'react'

import { Block } from 'notion-types'

import { Text } from '../components/text'
import { cs } from '../utils'

export const Quote: React.FC<{
  blockId: string
  block: Block
  children?: React.ReactNode
}> = ({ blockId, block, children }) => {
  if (!block.properties) return null

  const blockColor = block.format?.block_color

  return (
    <blockquote
      className={cs(
        'notion-quote',
        blockColor && `notion-${blockColor}`,
        blockId
      )}
    >
      <div>
        <Text value={block.properties.title} block={block} />
      </div>
      {children}
    </blockquote>
  )
}
