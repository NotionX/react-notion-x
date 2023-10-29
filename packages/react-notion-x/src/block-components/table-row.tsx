import * as React from 'react'

import * as types from 'notion-types'
import { Block } from 'notion-types'

import { Text } from '../components/text'
import { useNotionContext } from '../context'
import { cs } from '../utils'

export const TableRow: React.FC<{
  blockId: string
  block: Block
}> = ({ blockId, block }) => {
  const ctx = useNotionContext()
  const { recordMap } = ctx

  const tableBlock = recordMap.block[block.parent_id]?.value as types.TableBlock
  const order = tableBlock.format?.table_block_column_order
  const formatMap = tableBlock.format?.table_block_column_format
  const backgroundColor = block.format?.block_color

  if (!tableBlock || !order) {
    return null
  }

  return (
    <tr
      className={cs(
        'notion-simple-table-row',
        backgroundColor && `notion-${backgroundColor}`,
        blockId
      )}
    >
      {order.map((column) => {
        const color = formatMap?.[column]?.color

        return (
          <td
            key={column}
            className={color ? `notion-${color}` : ''}
            style={{
              width: formatMap?.[column]?.width || 120
            }}
          >
            <div className='notion-simple-table-cell'>
              <Text
                value={block.properties?.[column] || [['ㅤ']]}
                block={block}
              />
            </div>
          </td>
        )
      })}
    </tr>
  )
}
