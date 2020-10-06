import * as React from 'react'

import { formatDistance } from 'date-fns'
import { GoogleDriveBlock } from '../types'
import { useNotionContext } from '../context'
import { GracefulImage } from './graceful-image'

export const GoogleDrive: React.FC<{ block: GoogleDriveBlock }> = ({
  block
}) => {
  const { components, mapImageUrl } = useNotionContext()
  const properties = block.format?.drive_properties
  if (!properties) return null
  let domain

  try {
    const url = new URL(properties.url)
    domain = url.hostname
  } catch (err) {
    // ignore invalid urls for robustness
  }

  return (
    <div className='notion-google-drive'>
      <components.link
        className='notion-google-drive-link'
        href={properties.url}
        target='_blank'
        rel='noopener noreferrer'
      >
        <div className='notion-google-drive-preview'>
          <GracefulImage
            src={mapImageUrl(properties.thumbnail, block)}
            alt={properties.title || 'Google Drive Document'}
            loading='lazy'
          />
        </div>

        <div className='notion-google-drive-body'>
          {properties.title && (
            <div className='notion-google-drive-body-title'>
              {properties.title}
            </div>
          )}

          {properties.modified_time && (
            <div className='notion-google-drive-body-modified-time'>
              Last modified{' '}
              {properties.user_name ? `by ${properties.user_name} ` : ''}
              {formatDistance(
                new Date(properties.modified_time),
                new Date()
              )}{' '}
              ago
            </div>
          )}

          {properties.icon && domain && (
            <div className='notion-google-drive-body-source'>
              {properties.icon && (
                <div
                  className='notion-google-drive-body-source-icon'
                  style={{
                    backgroundImage: `url(${properties.icon})`
                  }}
                />
              )}

              {domain && (
                <div className='notion-google-drive-body-source-domain'>
                  {domain}
                </div>
              )}
            </div>
          )}
        </div>
      </components.link>
    </div>
  )
}
