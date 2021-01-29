import React from 'react'
import { getBlockIcon, getBlockTitle } from 'notion-utils'
import { Block, PageBlock, CalloutBlock } from 'notion-types'

import { cs, isUrl } from '../utils'
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
  className?: string
  hideDefaultIcon?: boolean
  defaultIcon?: string
}> = ({ block, className, hideDefaultIcon = false, defaultIcon }) => {
  const { mapImageUrl, recordMap } = useNotionContext()

  if (!isIconBlock(block)) {
    return null
  }

  const icon = getBlockIcon(block, recordMap) ?? defaultIcon
  const title = getBlockTitle(block, recordMap)

  if (icon && isUrl(icon)) {
    const url = mapImageUrl(icon, block)

    return (
      <GracefulImage
        className={cs(className, 'notion-page-icon')}
        src={url}
        alt={title ? title : 'Icon'}
        loading='lazy'
      />
    )
  } else {
    const iconValue = icon?.trim()

    if (!iconValue) {
      if (hideDefaultIcon) {
        return null
      }

      return (
        <DefaultPageIcon
          className={cs(className, 'notion-page-icon')}
          alt={title ? title : 'Page'}
        />
      )
    }

    return (
      <span
        className={cs(className, 'notion-page-icon')}
        role='img'
        aria-label={icon}
      >
        {iconValue}
      </span>
    )
  }
}
