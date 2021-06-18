import {
  SyncPointerBlock as SyncPointerBlockType,
  Block as BlockType
} from 'notion-types'
import React from 'react'

import { NotionBlockRenderer } from '../renderer'

export const SyncPointerBlock: React.FC<{
  block: BlockType
  level: number
}> = (props) => {
  const { block, level } = props

  if (!block) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('missing block', block.id)
    }
    return null
  }
  const syncPointerBlock = block as SyncPointerBlockType
  const referencePointerId =
    syncPointerBlock?.format?.transclusion_reference_pointer?.id

  if (!referencePointerId) return null

  return (
    <NotionBlockRenderer
      key={referencePointerId}
      level={level}
      blockId={referencePointerId}
    />
  )
}
