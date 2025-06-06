import type React from 'react'
import { type Block } from 'notion-types'

import { useNotionContext } from '../context'
import SvgTypeGitHub from '../icons/type-github'
import { cs, formatNotionDateTime } from '../utils'
import { MentionPreviewCard } from './mention-preview-card'

// External Object Instance
export function EOI({
  block,
  inline,
  className
}: {
  block: Block
  inline?: boolean
  className?: string
}) {
  const { components } = useNotionContext()
  const { original_url, attributes, domain } = block?.format || {}
  if (!original_url || !attributes) {
    return null
  }

  const title = attributes.find((attr: any) => attr.id === 'title')?.values[0]
  let owner = attributes.find((attr: any) => attr.id === 'owner')?.values[0]
  const lastUpdatedAt = attributes.find((attr: any) => attr.id === 'updated_at')
    ?.values[0]
  const lastUpdated = lastUpdatedAt ? formatNotionDateTime(lastUpdatedAt) : null
  let externalImage: React.ReactNode

  switch (domain) {
    case 'github.com':
      externalImage = <SvgTypeGitHub />
      if (owner) {
        const parts = owner.split('/')
        owner = parts.at(-1)
      }
      break

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `Unsupported external_object_instance domain "${domain}"`,
          JSON.stringify(block, null, 2)
        )
      }

      return null
  }

  return (
    <components.Link
      target='_blank'
      rel='noopener noreferrer'
      href={original_url}
      className={cs(
        'notion-external',
        inline ? 'notion-external-mention' : 'notion-external-block notion-row',
        className
      )}
    >
      {externalImage && (
        <div className='notion-external-image'>{externalImage}</div>
      )}

      <div className='notion-external-description'>
        <div className='notion-external-title'>{title}</div>
        {!inline && owner ? (
          <div className='notion-external-block-desc'>
            {owner}
            {lastUpdated && <span> • </span>}
            {lastUpdated && `Updated ${lastUpdated}`}
          </div>
        ) : null}
        {inline && (owner || lastUpdated) && (
          <MentionPreviewCard
            title={title}
            owner={owner}
            lastUpdated={lastUpdated}
            domain={domain}
            externalImage={externalImage}
          />
        )}
      </div>
    </components.Link>
  )
}
