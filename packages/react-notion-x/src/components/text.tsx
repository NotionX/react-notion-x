import React from 'react'
import { Block, Decoration } from 'notion-types'
import { parsePageId } from 'notion-utils'

import { useNotionContext } from '../context'
import { formatDate } from '../utils'
import { Equation } from './equation'
import { PageTitle } from './page-title'
import { GracefulImage } from './graceful-image'

/**
 * Renders a single piece of Notion text, including basic rich text formatting.
 *
 * These represent the innermost leaf nodes of a Notion subtree.
 *
 * TODO: I think this implementation would be more correct if the reduce just added
 * attributes to the final element's style.
 */
export const Text: React.FC<{
  value: Decoration[]
  block: Block
  linkProps?: any
  linkProtocol?: string
  inline?: boolean // TODO: currently unused
}> = ({ value, block, linkProps, linkProtocol }) => {
  const { components, recordMap, mapPageUrl, mapImageUrl } = useNotionContext()

  return (
    <React.Fragment>
      {value?.map(([text, decorations], index) => {
        // TODO: sometimes notion shows a max of N items to prevent overflow
        // if (trim && index > 18) {
        //   return null
        // }

        if (!decorations) {
          if (text === ',') {
            return <span key={index} style={{ padding: '0.5em' }} />
          } else {
            return <React.Fragment key={index}>{text}</React.Fragment>
          }
        }

        const formatted = decorations.reduce((element, decorator) => {
          switch (decorator[0]) {
            case 'p': {
              // link to an internal block (within the current workspace)
              const blockId = decorator[1]
              const linkedBlock = recordMap.block[blockId]?.value
              if (!linkedBlock) {
                console.log('"p" missing block', blockId)
                return null
              }

              // console.log('p', blockId)

              return (
                <components.pageLink
                  className='notion-link'
                  href={mapPageUrl(blockId)}
                >
                  <PageTitle block={linkedBlock} />
                </components.pageLink>
              )
            }

            case '‣': {
              // link to an external block (outside of the current workspace)
              const linkType = decorator[1][0]
              const id = decorator[1][1]

              switch (linkType) {
                case 'u':
                  const user = recordMap.notion_user[id]?.value

                  if (!user) {
                    console.log('"‣" missing user', id)
                    return null
                  }

                  const name = [user.given_name, user.family_name]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <GracefulImage
                      className='notion-user'
                      src={mapImageUrl(user.profile_photo, block)}
                      alt={name}
                    />
                  )

                default: {
                  const linkedBlock = recordMap.block[id]?.value

                  if (!linkedBlock) {
                    console.log('"‣" missing block', linkType, id)
                    return null
                  }

                  return (
                    <components.pageLink
                      className='notion-link'
                      href={mapPageUrl(id)}
                      {...linkProps}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <PageTitle block={linkedBlock} />
                    </components.pageLink>
                  )
                }
              }
            }

            case 'h':
              return <span className={`notion-${decorator[1]}`}>{element}</span>

            case 'c':
              return <code className='notion-inline-code'>{element}</code>

            case 'b':
              return <b>{element}</b>

            case 'i':
              return <em>{element}</em>

            case 's':
              return <s>{element}</s>

            case '_':
              return <span className='notion-inline-underscore'>{element}</span>

            case 'e':
              return <Equation math={decorator[1]} />

            case 'm':
              // comment / discussion
              return element //still need to return the base element

            case 'a': {
              const v = decorator[1]
              const pathname = v.substr(1)
              const id = parsePageId(pathname, { uuid: true })

              if (v[0] === '/' && id) {
                // console.log('a', id)

                return (
                  <components.pageLink
                    className='notion-link'
                    href={mapPageUrl(id)}
                    {...linkProps}
                  >
                    {element}
                  </components.pageLink>
                )
              } else {
                return (
                  <components.link
                    className='notion-link'
                    href={
                      linkProtocol
                        ? `${linkProtocol}:${decorator[1]}`
                        : decorator[1]
                    }
                    {...linkProps}
                  >
                    {element}
                  </components.link>
                )
              }
            }

            case 'd': {
              const v = decorator[1]
              const type = v?.type

              if (type === 'date') {
                // Example: Jul 31, 2010
                const startDate = v.start_date

                return formatDate(startDate)
              } else if (type === 'daterange') {
                // Example: Jul 31, 2010 → Jul 31, 2020
                const startDate = v.start_date
                const endDate = v.end_date

                return `${formatDate(startDate)} → ${formatDate(endDate)}`
              } else {
                return element
              }
            }

            case 'u': {
              const userId = decorator[1]
              const user = recordMap.notion_user[userId]?.value

              if (!user) {
                console.log('missing user', userId)
                return null
              }

              const name = [user.given_name, user.family_name]
                .filter(Boolean)
                .join(' ')

              return (
                <GracefulImage
                  className='notion-user'
                  src={mapImageUrl(user.profile_photo, block)}
                  alt={name}
                />
              )
            }

            default:
              if (process.env.NODE_ENV !== 'production') {
                console.log('unsupported text format', decorator)
              }

              return element
          }
        }, <>{text}</>)

        return <React.Fragment key={index}>{formatted}</React.Fragment>
      })}
    </React.Fragment>
  )
}
