import { type FileBlock } from 'notion-types'
import { getSignedFileUrl } from 'notion-utils'

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

  const source = getSignedFileUrl(
    block.properties?.source?.[0]?.[0],
    block,
    recordMap.signed_urls
  )

  if (!source) {
    return null
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
