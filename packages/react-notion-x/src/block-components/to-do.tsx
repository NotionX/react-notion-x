import * as React from 'react'

import { Block } from 'notion-types'

import { Text } from '../components/text'
import { useNotionContext } from '../context'
import { cs } from '../utils'

export const ToDo: React.FC<{
  blockId: string
  block: Block
  children: React.ReactNode
}> = ({ blockId, block, children }) => {
  const ctx = useNotionContext()

  if (!block.properties) return null

  const { components } = ctx

  const isChecked = block.properties?.checked?.[0]?.[0] === 'Yes'

  return (
    <div className={cs('notion-to-do', blockId)}>
      <div className='notion-to-do-item'>
        <components.Checkbox blockId={blockId} isChecked={isChecked} />

        <div
          className={cs(
            'notion-to-do-body',
            isChecked && `notion-to-do-checked`
          )}
        >
          <Text value={block.properties?.title} block={block} />
        </div>
      </div>

      <div className='notion-to-do-children'>{children}</div>
    </div>
  )
}
