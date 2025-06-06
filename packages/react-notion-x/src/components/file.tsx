import type React from 'react'
import { type FileBlock } from 'notion-types'

import { useNotionContext } from '../context'
import { FileIcon } from '../icons/file-icon'
import { cs } from '../utils'
import { Text } from './text'

export function File({
  block,
  className
}: {
  block: FileBlock
  className?: string
}) {
  const { components, recordMap } = useNotionContext()

  let source =
    recordMap.signed_urls[block.id] || block.properties?.source?.[0]?.[0]

  if (!source) {
    return null
  }

  if (block.space_id) {
    const url = new URL(source)
    url.searchParams.set('spaceId', block.space_id)
    source = url.toString()
  }

  return (
    <div className={cs('notion-file', className)}>
      <components.Link
        className='notion-file-link'
        href={source}
        target='_blank'
        rel='noopener noreferrer'
      >
        <FileIcon className='notion-file-icon' />

        <div className='notion-file-info'>
          <div className='notion-file-title'>
            <Text value={block.properties?.title || [['File']]} block={block} />
          </div>

          {block.properties?.size && (
            <div className='notion-file-size'>
              <Text value={block.properties.size} block={block} />
            </div>
          )}
        </div>
      </components.Link>
    </div>
  )
}
