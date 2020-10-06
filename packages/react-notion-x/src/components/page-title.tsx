import * as React from 'react'
import { Block } from '../types'
import { cs } from '../utils'
import { useNotionContext } from '../context'
import { Text } from './text'
import { PageIcon } from './page-icon'

export const PageTitle: React.FC<{
  block: Block
  className?: string
}> = ({ block, className, ...rest }) => {
  const { recordMap } = useNotionContext()

  if (!block) return null

  // TODO: replace with getBlockTitle
  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const collection = recordMap.collection[block.collection_id]?.value

    if (collection) {
      block.properties = {
        ...block.properties,
        title: collection.name
      }

      block.format = {
        ...block.format,
        page_icon: collection.icon
      }
    }
  }

  if (!block.properties?.title) {
    return null
  }

  return (
    <span className={cs('notion-page-title', className)} {...rest}>
      <PageIcon block={block} className='notion-page-title-icon' />

      <span className='notion-page-title-text'>
        <Text value={block.properties?.title} block={block} />
      </span>
    </span>
  )
}
