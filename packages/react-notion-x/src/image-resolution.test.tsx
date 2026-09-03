import { type Block, type ExtendedRecordMap } from 'notion-types'
import { defaultMapImageUrl } from 'notion-utils'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'

import { NotionContextProvider, useNotionContext } from './context'
import { NotionRenderer } from './renderer'

test('does not embed temporary signatures in public page image URLs', () => {
  const rootBlockId = '11111111-1111-4111-8111-111111111111'
  const notionImageBlockId = '22222222-2222-4222-8222-222222222222'
  const externalImageBlockId = '33333333-3333-4333-8333-333333333333'
  const spaceId = '44444444-4444-4444-8444-444444444444'

  const pageCover =
    'https://prod-files-secure.s3.us-west-2.amazonaws.com/cover-id/cover.jpg'
  const pageIcon = 'attachment:icon-id:icon.png'
  const notionImage = 'attachment:image-id:image.png'
  const externalImage =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'

  const temporaryPageCover = `https://file.notion.com/f/f/${spaceId}/cover-id/cover.jpg?table=block&id=${rootBlockId}&spaceId=${spaceId}&expirationTimestamp=4102444800000&signature=temporary-cover`
  const temporaryPageIcon = `https://file.notion.com/f/f/${spaceId}/icon-id/icon.png?table=block&id=${rootBlockId}&spaceId=${spaceId}&expirationTimestamp=4102444800000&signature=temporary-icon`
  const temporaryNotionImage = `https://file.notion.com/f/f/${spaceId}/image-id/image.png?table=block&id=${notionImageBlockId}&spaceId=${spaceId}&expirationTimestamp=4102444800000&signature=temporary-image`

  const recordMap = {
    block: {
      [rootBlockId]: {
        role: 'reader',
        value: {
          id: rootBlockId,
          type: 'page',
          parent_table: 'space',
          parent_id: spaceId,
          space_id: spaceId,
          content: [notionImageBlockId, externalImageBlockId],
          properties: {
            title: [['Image URL regression']]
          },
          format: {
            page_cover: pageCover,
            page_icon: pageIcon,
            page_cover_position: 0.5
          },
          permissions: [{ role: 'reader', type: 'public_permission' }]
        }
      },
      [notionImageBlockId]: {
        role: 'reader',
        value: {
          id: notionImageBlockId,
          type: 'image',
          parent_table: 'block',
          parent_id: rootBlockId,
          space_id: spaceId,
          properties: {
            source: [[notionImage]],
            alt_text: [['Notion image']]
          }
        }
      },
      [externalImageBlockId]: {
        role: 'reader',
        value: {
          id: externalImageBlockId,
          type: 'image',
          parent_table: 'block',
          parent_id: rootBlockId,
          space_id: spaceId,
          properties: {
            source: [[externalImage]],
            alt_text: [['External image']]
          }
        }
      }
    },
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {
      [pageCover]: temporaryPageCover,
      [pageIcon]: temporaryPageIcon,
      [notionImage]: temporaryNotionImage,
      [rootBlockId]: temporaryPageCover,
      [notionImageBlockId]: temporaryNotionImage
    }
  } as unknown as ExtendedRecordMap

  const receivedImageSources: string[] = []
  const Image = ({ src }: { src: string }) => {
    receivedImageSources.push(src)
    return null
  }

  renderToStaticMarkup(
    <NotionRenderer
      recordMap={recordMap}
      fullPage
      forceCustomImages
      disableHeader
      components={{ nextImage: Image }}
    />
  )

  const normalizedImageSources = receivedImageSources.map((src) => {
    const url = new URL(src)

    if (
      url.origin === 'https://app.notion.com' &&
      url.pathname.startsWith('/image/')
    ) {
      return {
        source: decodeURIComponent(url.pathname.slice('/image/'.length)),
        table: url.searchParams.get('table'),
        id: url.searchParams.get('id')
      }
    }

    return src
  })

  expect(normalizedImageSources).toEqual([
    {
      source: pageCover,
      table: 'block',
      id: rootBlockId
    },
    {
      source: pageIcon,
      table: 'block',
      id: rootBlockId
    },
    {
      source: notionImage,
      table: 'block',
      id: notionImageBlockId
    },
    externalImage
  ])

  receivedImageSources.length = 0
  const customMapperSources: Array<string | undefined> = []
  renderToStaticMarkup(
    <NotionRenderer
      recordMap={recordMap}
      fullPage
      forceCustomImages
      disableHeader
      mapImageUrl={(source) => {
        customMapperSources.push(source)
        return source
      }}
      components={{ nextImage: Image }}
    />
  )

  expect(customMapperSources).toEqual(receivedImageSources)
  expect(customMapperSources).not.toContain(temporaryPageCover)
  expect(customMapperSources).not.toContain(temporaryPageIcon)
  expect(customMapperSources).not.toContain(temporaryNotionImage)
  expect(
    customMapperSources.filter((source) =>
      source?.startsWith('https://app.notion.com/image/')
    )
  ).toHaveLength(3)
})

test('uses a fresh signed image URL for a private page', () => {
  const rootBlockId = '11111111-1111-4111-8111-111111111111'
  const imageBlockId = '22222222-2222-4222-8222-222222222222'
  const imageSource = 'attachment:image-id:image.png'
  const signedImage =
    'https://file.notion.com/f/f/space-id/image-id/image.png?expirationTimestamp=4102444800000&signature=current'
  const recordMap = {
    block: {
      [rootBlockId]: {
        role: 'reader',
        value: {
          id: rootBlockId,
          type: 'page',
          parent_table: 'space',
          content: [imageBlockId],
          properties: { title: [['Private image']] },
          format: {},
          permissions: [{ role: 'reader', type: 'user_permission' }]
        }
      },
      [imageBlockId]: {
        role: 'reader',
        value: {
          id: imageBlockId,
          type: 'image',
          parent_table: 'block',
          parent_id: rootBlockId,
          properties: {
            source: [[imageSource]],
            alt_text: [['Private image']]
          }
        }
      }
    },
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {
      [imageSource]: signedImage,
      [imageBlockId]: signedImage
    }
  } as unknown as ExtendedRecordMap
  const receivedImageSources: string[] = []
  const Image = ({ src }: { src: string }) => {
    receivedImageSources.push(src)
    return null
  }

  renderToStaticMarkup(
    <NotionRenderer
      recordMap={recordMap}
      forceCustomImages
      components={{ nextImage: Image }}
    />
  )

  expect(receivedImageSources).toEqual([signedImage])

  receivedImageSources.length = 0
  const customMapperSources: Array<string | undefined> = []
  renderToStaticMarkup(
    <NotionRenderer
      recordMap={recordMap}
      forceCustomImages
      mapImageUrl={(source) => {
        customMapperSources.push(source)
        return source
      }}
      components={{ nextImage: Image }}
    />
  )

  expect(customMapperSources).toEqual([signedImage])
  expect(receivedImageSources).toEqual([signedImage])
})

test('keeps the stable default mapper through nested public providers', () => {
  const rootBlockId = '11111111-1111-4111-8111-111111111111'
  const imageBlockId = '22222222-2222-4222-8222-222222222222'
  const imageSource = 'attachment:image-id:image.png'
  const signedImage =
    'https://file.notion.com/f/f/space-id/image-id/image.png?expirationTimestamp=4102444800000&signature=temporary'
  const imageBlock = {
    id: imageBlockId,
    type: 'image',
    parent_table: 'block',
    properties: { source: [[imageSource]] }
  } as Block
  const recordMap = {
    block: {
      [rootBlockId]: {
        role: 'reader',
        value: {
          id: rootBlockId,
          type: 'page',
          parent_table: 'space',
          format: {},
          permissions: [{ role: 'reader', type: 'public_permission' }]
        }
      },
      [imageBlockId]: { role: 'reader', value: imageBlock }
    },
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {
      [imageSource]: signedImage,
      [imageBlockId]: signedImage
    }
  } as unknown as ExtendedRecordMap
  const Probe = () => {
    const { mapImageUrl } = useNotionContext()
    return <img src={mapImageUrl(imageSource, imageBlock)} alt='' />
  }
  const NestedProvider = () => {
    const context = useNotionContext()
    return (
      <NotionContextProvider {...context}>
        <Probe />
      </NotionContextProvider>
    )
  }

  const markup = renderToStaticMarkup(
    <NotionContextProvider
      recordMap={recordMap}
      mapImageUrl={defaultMapImageUrl}
    >
      <NestedProvider />
    </NotionContextProvider>
  )
  const mappedImage = /<img[^>]+src="([^"]+)"/
    .exec(markup)?.[1]
    ?.replaceAll('&amp;', '&')

  expect(mappedImage).not.toBe(signedImage)
  expect(
    decodeURIComponent(new URL(mappedImage!).pathname.slice('/image/'.length))
  ).toBe(imageSource)
})
