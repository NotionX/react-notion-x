import { type ExtendedRecordMap } from 'notion-types'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'

import { NotionRenderer } from './renderer'

test('disables custom image optimization for external bookmark images', () => {
  const bookmarkId = 'ebc66f4b-4af4-4b2d-8024-04f8e7dd8d95'
  const receivedImageProps: Array<Record<string, unknown>> = []

  const recordMap = {
    block: {
      [bookmarkId]: {
        role: 'reader',
        value: {
          id: bookmarkId,
          type: 'bookmark',
          parent_table: 'block',
          properties: {
            link: [['https://github.com']],
            title: [['GitHub']],
            description: [['GitHub is where people build software.']]
          },
          format: {
            bookmark_icon: 'https://github.com/favicon.ico',
            bookmark_cover:
              'https://github.githubassets.com/images/modules/open_graph/github-logo.png'
          }
        }
      }
    },
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {}
  } as unknown as ExtendedRecordMap

  const NextImage = (props: Record<string, unknown>) => {
    receivedImageProps.push(props)
    return null
  }

  renderToStaticMarkup(
    <NotionRenderer
      recordMap={recordMap}
      components={{ nextImage: NextImage }}
    />
  )

  expect(receivedImageProps).toHaveLength(2)
  expect(receivedImageProps).toEqual([
    expect.objectContaining({
      src: 'https://github.com/favicon.ico',
      unoptimized: true
    }),
    expect.objectContaining({
      src: 'https://github.githubassets.com/images/modules/open_graph/github-logo.png',
      unoptimized: true
    })
  ])
})
