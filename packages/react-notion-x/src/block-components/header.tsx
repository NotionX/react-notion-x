import * as React from 'react'

import { Block } from 'notion-types'
import {
  getBlockParentPage,
  getPageTableOfContents,
  getTextContent,
  uuidToId
} from 'notion-utils'

import { Text } from '../components/text'
import { useNotionContext } from '../context'
import { LinkIcon } from '../icons/link-icon'
import { cs } from '../utils'

// TODO: use react state instead of a global for this
const tocIndentLevelCache: {
  [blockId: string]: number
} = {}

export const TextHeader: React.FC<{
  blockId: string
  block: Block
  children?: React.ReactNode
}> = ({ blockId, block, children }) => {
  const ctx = useNotionContext()
  const { recordMap } = ctx

  if (!block.properties) return null

  const blockColor = block.format?.block_color
  const id = uuidToId(block.id)
  const title = getTextContent(block.properties.title) || `Notion Header ${id}`

  // we use a cache here because constructing the ToC is non-trivial
  let indentLevel = tocIndentLevelCache[block.id]
  let indentLevelClass: string

  if (indentLevel === undefined) {
    const page = getBlockParentPage(block, recordMap)

    if (page) {
      const toc = getPageTableOfContents(page, recordMap)
      const tocItem = toc.find((tocItem) => tocItem.id === block.id)

      if (tocItem) {
        indentLevel = tocItem.indentLevel
        tocIndentLevelCache[block.id] = indentLevel
      }
    }
  }

  if (indentLevel !== undefined) {
    indentLevelClass = `notion-h-indent-${indentLevel}`
  }

  const isH1 = block.type === 'header'
  const isH2 = block.type === 'sub_header'
  const isH3 = block.type === 'sub_sub_header'

  const classNameStr = cs(
    isH1 && 'notion-h notion-h1',
    isH2 && 'notion-h notion-h2',
    isH3 && 'notion-h notion-h3',
    blockColor && `notion-${blockColor}`,
    indentLevelClass,
    blockId
  )

  const innerHeader = (
    <span>
      <div id={id} className='notion-header-anchor' />
      {!block.format?.toggleable && (
        <a className='notion-hash-link' href={`#${id}`} title={title}>
          <LinkIcon />
        </a>
      )}

      <span className='notion-h-title'>
        <Text value={block.properties.title} block={block} />
      </span>
    </span>
  )
  let headerBlock = null

  //page title takes the h1 so all header blocks are greater
  if (isH1) {
    headerBlock = (
      <h2 className={classNameStr} data-id={id}>
        {innerHeader}
      </h2>
    )
  } else if (isH2) {
    headerBlock = (
      <h3 className={classNameStr} data-id={id}>
        {innerHeader}
      </h3>
    )
  } else {
    headerBlock = (
      <h4 className={classNameStr} data-id={id}>
        {innerHeader}
      </h4>
    )
  }

  if (block.format?.toggleable) {
    return (
      <details className={cs('notion-toggle', blockId)}>
        <summary>{headerBlock}</summary>
        <div>{children}</div>
      </details>
    )
  } else {
    return headerBlock
  }
}
