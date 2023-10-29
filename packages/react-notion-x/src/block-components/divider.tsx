import * as React from 'react'

import { Block } from 'notion-types'

import { cs } from '../utils'

export const Divider: React.FC<{
  blockId: string
  block: Block
}> = ({ blockId }) => {
  return <hr className={cs('notion-hr', blockId)} />
}
