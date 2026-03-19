import type { BlockMap } from 'notion-types'

import { getBlockValue } from './get-block-value'

export function groupBlockContent(blockMap: BlockMap): string[][] {
  const output: string[][] = []

  let lastType: string | undefined
  let index = -1

  for (const id of Object.keys(blockMap)) {
    const blockValue = getBlockValue(blockMap[id])

    if (blockValue) {
      if (blockValue.content)
        for (const blockId of blockValue.content) {
          const blockType = getBlockValue(blockMap[blockId])?.type

          if (blockType && blockType !== lastType) {
            index++
            lastType = blockType
            output[index] = []
          }

          if (index > -1) {
            output[index]?.push(blockId)
          }
        }
    }

    lastType = undefined
  }

  return output
}
