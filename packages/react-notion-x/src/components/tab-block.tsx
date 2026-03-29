import type * as types from 'notion-types'
import { getBlockValue, getTextContent, uuidToId } from 'notion-utils'
import React from 'react'

import { Block, type BlockProps } from '../block'
import { useNotionContext } from '../context'
import { cs } from '../utils'

export type TabBlockProps = Omit<BlockProps, 'children'> & {
  block: types.TabBlock
  blockId: string
}

export function TabBlock(props: TabBlockProps) {
  const { recordMap } = useNotionContext()
  const { block, blockId, level, ...forwardProps } = props

  const tabIds = block.content ?? []
  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    if (!tabIds.length) return
    setActiveIndex((i) => Math.min(i, tabIds.length - 1))
  }, [tabIds.length])

  const renderSubtree = (childBlockId: string, lvl: number) => {
    const b = getBlockValue(recordMap.block[childBlockId]) as
      | types.Block
      | undefined
    if (!b) return null
    return (
      <Block key={childBlockId} {...forwardProps} block={b} level={lvl}>
        {b.content?.map((cid) => renderSubtree(cid, lvl + 1))}
      </Block>
    )
  }

  if (!tabIds.length) {
    return <div className={cs('notion-tab-block', 'notion-blank', blockId)} />
  }

  const safeIndex = Math.min(activeIndex, tabIds.length - 1)
  const activeTabId = tabIds[safeIndex]
  if (!activeTabId) {
    return <div className={cs('notion-tab-block', 'notion-blank', blockId)} />
  }
  const activeTabBlock = getBlockValue(recordMap.block[activeTabId])
  const panelBlocks = activeTabBlock?.content ?? []

  const baseId = `notion-tab-${uuidToId(block.id)}`

  return (
    <div
      className={cs('notion-selectable', 'notion-tab-block', blockId)}
      data-block-id={uuidToId(block.id)}
      dir='ltr'
    >
      <div className='notion-tab-block-inner'>
        <div className='notion-tab-header-row'>
          <div className='notion-tab-scroll-host'>
            <div className='notion-tab-scroll'>
              <div
                role='tablist'
                aria-label='Tab block'
                className='notion-tab-list-inner'
              >
                {tabIds.map((tabId, i) => {
                  const tabLabelBlock = getBlockValue(recordMap.block[tabId])
                  const rawTitle = tabLabelBlock
                    ? getTextContent(tabLabelBlock.properties?.title)
                    : ''
                  const label =
                    rawTitle.trim() !== '' ? rawTitle : `Tab ${i + 1}`
                  const isSelected = i === safeIndex

                  return (
                    <div key={tabId} className='notion-tab-pill-wrap'>
                      <button
                        type='button'
                        role='tab'
                        id={`${baseId}-tab-${i}`}
                        aria-selected={isSelected}
                        aria-controls={`${baseId}-panel`}
                        aria-posinset={i + 1}
                        aria-setsize={tabIds.length}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => setActiveIndex(i)}
                        className={cs(
                          'notion-tab-button',
                          isSelected && 'notion-tab-button-active'
                        )}
                      >
                        <span className='notion-tab-button-label notranslate'>
                          {label}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className='notion-tab-add-placeholder' aria-hidden />
        </div>

        <div
          role='tabpanel'
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${safeIndex}`}
          className='notion-tab-panel'
        >
          {panelBlocks.map((childId: string) =>
            renderSubtree(childId, level + 1)
          )}
        </div>
      </div>
    </div>
  )
}
