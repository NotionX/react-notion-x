import type { BlockMap } from 'notion-types'

import { getBlockValue } from './get-block-value'

export const getListNestingLevel = (
  blockId: string,
  blockMap: BlockMap
): number => {
  let level = 0
  let currentBlockId = blockId

  while (true) {
    const parentId = getBlockValue(blockMap[currentBlockId])?.parent_id

    if (!parentId) break

    const parentBlock = getBlockValue(blockMap[parentId])
    if (!parentBlock) break

    if (parentBlock.type === 'numbered_list') {
      level++
      currentBlockId = parentId
    } else {
      break
    }
  }

  return level
}
