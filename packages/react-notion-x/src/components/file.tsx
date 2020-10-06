import * as React from 'react'

import { FileIcon } from '../icons/file-icon'
import { FileBlock } from 'notion-types'
import { useNotionContext } from '../context'
import { Text } from './text'

export const File: React.FC<{
  block: FileBlock
}> = ({ block }) => {
  const { components, recordMap } = useNotionContext()
  const signedUrl = recordMap.signed_urls[block.id]

  return (
    <div className='notion-file'>
      <components.link
        className='notion-file-link'
        href={signedUrl}
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
      </components.link>
    </div>
  )
}
