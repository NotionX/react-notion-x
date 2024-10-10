import * as React from 'react'

import { Block } from 'notion-types'

import { useNotionContext } from '../context'
import { cs } from '../utils'

export const Column: React.FC<{
  blockId: string
  block: Block
  children?: React.ReactNode
}> = ({ blockId, children, block }) => {
  const ctx = useNotionContext()
  const { recordMap } = ctx

  // note: notion uses 46px
  const spacerWidth = `min(32px, 4vw)`
  const ratio = block.format?.column_ratio || 0.5
  const parent = recordMap.block[block.parent_id]?.value
  const columns = parent?.content?.length || Math.max(2, Math.ceil(1.0 / ratio))

  const width = `calc((100% - (${columns - 1} * ${spacerWidth})) * ${ratio})`
  const style = { width }

  return (
    <>
      <div className={cs('notion-column', blockId)} style={style}>
        {children}
      </div>

      <div className='notion-spacer' />
    </>
  )
}
