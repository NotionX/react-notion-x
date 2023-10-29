import * as React from 'react'

import { Block } from 'notion-types'

import { cs } from '../utils'

export const Table: React.FC<{
  blockId: string
  block: Block
  children: React.ReactNode
}> = ({ blockId, children }) => {
  return (
    <table className={cs('notion-simple-table', blockId)}>
      <tbody>{children}</tbody>
    </table>
  )
}
