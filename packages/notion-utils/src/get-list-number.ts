import type { BlockMap } from 'notion-types'

import { getBlockValue } from './get-block-value'
import { groupBlockContent } from './group-block-content'

export function getListNumber(blockId: string, blockMap: BlockMap) {
  const groups = groupBlockContent(blockMap)
  const group = groups.find((g) => g.includes(blockId))

  if (!group) {
    return
  }

  const groupIndex = group.indexOf(blockId) + 1
  const startIndex = getBlockValue(blockMap[blockId])?.format?.list_start_index
  return getBlockValue(blockMap[blockId])?.type === 'numbered_list'
    ? (startIndex ?? groupIndex)
    : groupIndex
}
