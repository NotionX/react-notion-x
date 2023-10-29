import * as React from 'react'

import { Block } from 'notion-types'
import {
  getBlockParentPage,
  getPageTableOfContents,
  uuidToId
} from 'notion-utils'

import { useNotionContext } from '../context'
import { cs } from '../utils'

export const TableOfContents: React.FC<{
  blockId: string
  block: Block
}> = ({ blockId, block }) => {
  const ctx = useNotionContext()
  const { recordMap } = ctx

  const page = getBlockParentPage(block, recordMap)
  if (!page) return null

  const toc = getPageTableOfContents(page, recordMap)
  const blockColor = block.format?.block_color

  return (
    <div
      className={cs(
        'notion-table-of-contents',
        blockColor && `notion-${blockColor}`,
        blockId
      )}
    >
      {toc.map((tocItem) => (
        <a
          key={tocItem.id}
          href={`#${uuidToId(tocItem.id)}`}
          className='notion-table-of-contents-item'
        >
          <span
            className='notion-table-of-contents-item-body'
            style={{
              display: 'inline-block',
              marginLeft: tocItem.indentLevel * 24
            }}
          >
            {tocItem.text}
          </span>
        </a>
      ))}
    </div>
  )
}
