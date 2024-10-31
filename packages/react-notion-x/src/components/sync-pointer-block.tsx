import type * as React from 'react'
import {
  type Block as BlockType,
  type SyncPointerBlock as SyncPointerBlockType
} from 'notion-types'

import { NotionBlockRenderer } from '../renderer'

export const SyncPointerBlock: React.FC<{
  block: BlockType
  level: number
}> = ({ block, level }) => {
  if (!block) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('missing sync pointer block')
    }

    return null
  }

  const syncPointerBlock = block as SyncPointerBlockType
  const referencePointerId =
    syncPointerBlock?.format?.transclusion_reference_pointer?.id

  if (!referencePointerId) {
    return null
  }

  return (
    <NotionBlockRenderer
      key={referencePointerId}
      level={level}
      blockId={referencePointerId}
    />
  )
}
