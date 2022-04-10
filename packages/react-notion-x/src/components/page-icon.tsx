import * as React from 'react'
import { getBlockIcon, getBlockTitle } from 'notion-utils'
import { Block, PageBlock, CalloutBlock } from 'notion-types'

import { cs, isUrl } from '../utils'
import { DefaultPageIcon } from '../icons/default-page-icon'
import { useNotionContext } from '../context'
import { LazyImage } from './lazy-image'

const isIconBlock = (value: Block): value is PageBlock | CalloutBlock => {
  return (
    value.type === 'page' ||
    value.type === 'callout' ||
    value.type === 'collection_view' ||
    value.type === 'collection_view_page'
  )
}

export const PageIconImpl: React.FC<{
  block: Block
  className?: string
  inline?: boolean
  hideDefaultIcon?: boolean
  defaultIcon?: string
}> = ({
  block,
  className,
  inline = true,
  hideDefaultIcon = false,
  defaultIcon
}) => {
  const { mapImageUrl, recordMap } = useNotionContext()
  let isImage = false
  let content: any = null

  if (isIconBlock(block)) {
    const icon = getBlockIcon(block, recordMap)?.trim() || defaultIcon
    const title = getBlockTitle(block, recordMap)

    if (icon && isUrl(icon)) {
      const url = mapImageUrl(icon, block)
      isImage = true

      content = (
        <LazyImage
          src={url}
          alt={title || 'page icon'}
          className={cs(className, 'notion-page-icon')}
        />
      )
    } else if (!icon) {
      if (!hideDefaultIcon) {
        isImage = true
        content = (
          <DefaultPageIcon
            className={cs(className, 'notion-page-icon')}
            alt={title ? title : 'page icon'}
          />
        )
      }
    } else {
      isImage = false
      content = (
        <span
          className={cs(className, 'notion-page-icon')}
          role='img'
          aria-label={icon}
        >
          {icon}
        </span>
      )
    }
  }

  if (!content) {
    return null
  }

  return (
    <div
      className={cs(
        inline ? 'notion-page-icon-inline' : 'notion-page-icon-hero',
        isImage ? 'notion-page-icon-image' : 'notion-page-icon-span'
      )}
    >
      {content}
    </div>
  )
}

export const PageIcon = React.memo(PageIconImpl)
