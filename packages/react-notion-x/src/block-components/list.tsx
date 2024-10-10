import * as React from 'react'

import { Block } from 'notion-types'

import { Text } from '../components/text'
import { useNotionContext } from '../context'
import { cs, getListNumber } from '../utils'

export const List: React.FC<{
  blockId: string
  block: Block
  children?: React.ReactNode
}> = ({ blockId, block, children }) => {
  const ctx = useNotionContext()
  const { recordMap } = ctx

  const wrapList = (content: React.ReactNode, start?: number) =>
    block.type === 'bulleted_list' ? (
      <ul className={cs('notion-list', 'notion-list-disc', blockId)}>
        {content}
      </ul>
    ) : (
      <ol
        start={start}
        className={cs('notion-list', 'notion-list-numbered', blockId)}
      >
        {content}
      </ol>
    )

  let output: JSX.Element | null = null

  if (block.content) {
    output = (
      <>
        {block.properties && (
          <li>
            <Text value={block.properties.title} block={block} />
          </li>
        )}
        {wrapList(children)}
      </>
    )
  } else {
    output = block.properties ? (
      <li>
        <Text value={block.properties.title} block={block} />
      </li>
    ) : null
  }

  const isTopLevel =
    block.type !== recordMap.block[block.parent_id]?.value?.type
  const start = getListNumber(block.id, recordMap.block)

  return isTopLevel ? wrapList(output, start) : output
}
