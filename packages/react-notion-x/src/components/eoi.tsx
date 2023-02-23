import * as React from 'react'

import { Block } from 'notion-types'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'

import { NotionDateTime, getNotionDateTime } from 'notion-utils'
import { cs, formatNotionDateTime } from '../utils'
import { useNotionContext } from '../context'
import SvgTypeGitHub from '../icons/type-github'

// External Object Instance
export const EOI: React.FC<{
  block: Block
  inline?: boolean
  className?: string
}> = ({ block, inline, className }) => {
  const { components } = useNotionContext()
  const { original_url, attributes, domain } = block?.format || {}
  if (!original_url) {
    return null
  }

  let externalImage: React.ReactNode
  let owner: string = attributes?.find((attr) => attr.id === 'owner')?.values[0]
  let title: string = attributes?.find((attr) => attr.id === 'title')?.values[0]

  switch (domain) {
    case 'github.com': {
      externalImage = <SvgTypeGitHub />
      const parts = new URL(original_url).pathname.split('/')
      owner = parts[1]
      title = parts[2]
      break
    }

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `Unsupported external_object_instance domain "${domain}"`,
          JSON.stringify(block, null, 2)
        )
      }

      return null
  }

  if (inline) {
    return (
      <components.Link
        target='_blank'
        rel='noopener noreferrer'
        href={original_url}
        className={cs('notion-external', 'notion-external-mention', className)}
      >
        {externalImage}
        <div className='notion-external-title'>{title}</div>
      </components.Link>
    )
  } else {
    const lastUpdatedAt: NotionDateTime = attributes?.find(
      (attr) => attr.id === 'updated_at'
    )?.values[0]

    const lastUpdated =
      lastUpdatedAt &&
      formatDistanceToNowStrict(
        getNotionDateTime(
          lastUpdatedAt.start_date,
          lastUpdatedAt.start_time,
          lastUpdatedAt.time_zone
        ),
        { addSuffix: true }
      )

    return (
      <components.Link
        target='_blank'
        rel='noopener noreferrer'
        href={original_url}
        className={cs(
          'notion-external',
          'notion-external-block notion-row',
          className
        )}
      >
        {externalImage && (
          <div className='notion-external-image'>{externalImage}</div>
        )}

        <div className='notion-external-description'>
          <div className='notion-external-title'>{title}</div>
          <div className='notion-external-subtitle'>
            <span>{owner}</span>
            {lastUpdated && <span> • Updated {lastUpdated}</span>}
          </div>
        </div>
      </components.Link>
    )
  }
}
