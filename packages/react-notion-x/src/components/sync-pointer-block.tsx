import type React from 'react'
import {
  type Block as BlockType,
  type SyncPointerBlock as SyncPointerBlockType
} from 'notion-types'

import { NotionBlockRenderer } from '../renderer'

export function SyncPointerBlock({
  block,
  level
}: {
  block: BlockType
  level: number
}) {
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
