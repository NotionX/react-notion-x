import * as React from 'react'

import { Block } from 'notion-types'

import { cs } from '../utils'

export const ColumnList: React.FC<{
  blockId: string
  block: Block
  children?: React.ReactNode
}> = ({ blockId, children }) => {
  return <div className={cs('notion-row', blockId)}>{children}</div>
}
