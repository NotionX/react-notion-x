import * as React from 'react'

import { Block } from 'notion-types'

import { Text } from '../components/text'
import { cs } from '../utils'

export const Toggle: React.FC<{
  blockId: string
  block: Block
  children?: React.ReactNode
}> = ({ blockId, block, children }) => {
  return (
    <details className={cs('notion-toggle', blockId)}>
      <summary>
        <Text value={block.properties?.title} block={block} />
      </summary>

      <div>{children}</div>
    </details>
  )
}
