import * as React from 'react'
import isUrl from 'is-url-superb'
import { getBlockIcon, getBlockTitle } from 'notion-utils'

import { Block, PageBlock, CalloutBlock } from '../types'
import { cs } from '../utils'
import { DefaultPageIcon } from '../icons/default-page-icon'
import { useNotionContext } from '../context'
import { GracefulImage } from './graceful-image'

const isIconBlock = (value: Block): value is PageBlock | CalloutBlock => {
  return (
    value.type === 'page' ||
    value.type === 'callout' ||
    value.type === 'collection_view' ||
    value.type === 'collection_view_page'
  )
}

export const PageIcon: React.FC<{
  block: Block
  large?: boolean
  className?: string
}> = ({ block, className, large = false }) => {
  const { mapImageUrl, recordMap } = useNotionContext()

  if (!isIconBlock(block)) {
    return null
  }

  const icon = getBlockIcon(block, recordMap)
  const title = getBlockTitle(block, recordMap)

  if (icon && isUrl(icon)) {
    const url = mapImageUrl(icon, block)

    return (
      <GracefulImage
        className={cs(
          className,
          large ? 'notion-page-icon-cover' : 'notion-page-icon'
        )}
        src={url}
        alt={title ? title : 'Icon'}
        loading='lazy'
      />
    )
  } else {
    const iconValue = icon?.trim()

    if (!iconValue) {
      return (
        <DefaultPageIcon
          className={cs(
            className,
            large ? 'notion-page-icon-cover' : 'notion-page-icon'
          )}
          alt={title ? title : 'Page'}
        />
      )
    }

    return (
      <span
        className={cs(
          className,
          large ? 'notion-page-icon-cover' : 'notion-page-icon'
        )}
        role='img'
        aria-label={icon}
      >
        {iconValue}
      </span>
    )
  }
}
