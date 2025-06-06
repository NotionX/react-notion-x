import React from 'react'

export type LinkMentionData = {
  href: string
  title: string
  icon_url: string
  description: string
  link_provider: string
  thumbnail_url: string
}

export function LinkMention({ metadata }: { metadata: LinkMentionData }) {
  return (
    <span className='notion-link-mention'>
      <LinkMentionInline metadata={metadata} />
      <LinkMentionPreview metadata={metadata} />
    </span>
  )
}

function LinkMentionInline({ metadata }: { metadata: LinkMentionData }) {
  return (
    <a
      href={metadata.href}
      target='_blank'
      rel='noopener noreferrer'
      className='notion-link-mention-link'
    >
      <img
        className='notion-link-mention-icon'
        src={metadata.icon_url}
        alt={metadata.link_provider}
      />
      {metadata.link_provider && (
        <span className='notion-link-mention-provider'>
          {metadata.link_provider}
        </span>
      )}
      <span className='notion-link-mention-title'>{metadata.title}</span>
    </a>
  )
}

function LinkMentionPreview({ metadata }: { metadata: LinkMentionData }) {
  return (
    <div className='notion-link-mention-preview'>
      <article className='notion-link-mention-card'>
        <img
          className='notion-link-mention-preview-thumbnail'
          src={metadata.thumbnail_url}
          alt={metadata.title}
          referrerPolicy='same-origin'
        />
        <div className='notion-link-mention-preview-content'>
          <p className='notion-link-mention-preview-title'>{metadata.title}</p>
          <p className='notion-link-mention-preview-description'>
            {metadata.description}
          </p>
          <div className='notion-link-mention-preview-footer'>
            <img
              className='notion-link-mention-preview-icon'
              src={metadata.icon_url}
              alt={metadata.link_provider}
              referrerPolicy='same-origin'
            />
            <span className='notion-link-mention-preview-provider'>
              {metadata.link_provider}
            </span>
          </div>
        </div>
      </article>
    </div>
  )
}
