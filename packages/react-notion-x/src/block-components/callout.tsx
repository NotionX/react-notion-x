import * as React from 'react'

import { Block } from 'notion-types'

import { PageIcon } from '../components/page-icon'
import { Text } from '../components/text'
import { cs } from '../utils'

export const Callout: React.FC<{
  blockId: string
  block: Block
  children?: React.ReactNode
}> = ({ blockId, block, children }) => {
  return (
    <div
      className={cs(
        'notion-callout',
        block.format?.block_color && `notion-${block.format?.block_color}_co`,
        blockId
      )}
    >
      <PageIcon block={block} />

      <div className='notion-callout-text'>
        <Text value={block.properties?.title} block={block} />
        {children}
      </div>
    </div>
  )
}
