import { type Block, type ExtendedRecordMap } from 'notion-types'
import { describe, expect, test } from 'vitest'

import { defaultMapImageUrl, getPageImageUrls } from './index'

const imageBlock = {
  id: 'block-id',
  type: 'image',
  parent_table: 'block',
  properties: {
    source: [['attachment:file-id:image.png']]
  }
} as Block

const expectStableNotionProxy = (
  mappedUrl: string | undefined,
  privateSource: string
) => {
  expect(mappedUrl).toBeDefined()

  const url = new URL(mappedUrl!)
  expect(url.origin).toBe('https://app.notion.com')
  expect(decodeURIComponent(url.pathname.slice('/image/'.length))).toBe(
    privateSource
  )
  expect(Object.fromEntries(url.searchParams)).toEqual({
    table: 'block',
    id: imageBlock.id,
    cache: 'v2'
  })
}

describe('stable Notion image URL mapping', () => {
  test.each([
    {
      name: 'unsigned legacy S3 object',
      source:
        'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/file-id/image.png',
      privateSource:
        'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/file-id/image.png'
    },
    {
      name: 'signed legacy S3 object',
      source:
        'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/file-id/image.png?X-Amz-Date=20200101T000000Z&X-Amz-Expires=60&X-Amz-Credential=expired&X-Amz-Signature=expired',
      privateSource:
        'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/file-id/image.png'
    },
    {
      name: 'attachment source',
      source: 'attachment:file-id:image.png',
      privateSource: 'attachment:file-id:image.png'
    },
    {
      name: 'current file.notion.com signed URL',
      source:
        'https://file.notion.com/f/f/space-id/file-id/image%20one.png?table=block&id=stale-block-id&spaceId=space-id&expirationTimestamp=1&signature=expired',
      privateSource: 'attachment:file-id:image one.png'
    },
    {
      name: 'current file.notion.so URL with a Unicode filename',
      source:
        'https://file.notion.so/f/f/space-id/file-id/%E7%8C%AB%20%26%20dog.png?expirationTimestamp=1&signature=expired',
      privateSource: 'attachment:file-id:猫 & dog.png'
    }
  ])('maps a $name to a stable Notion proxy', ({ source, privateSource }) => {
    expect.hasAssertions()
    expectStableNotionProxy(
      defaultMapImageUrl(source, imageBlock),
      privateSource
    )
  })

  test.each([
    [
      '/images/page-cover/met_william_morris_1877.jpg',
      'https://app.notion.com/images/page-cover/met_william_morris_1877.jpg'
    ],
    ['/icons/gray-link.svg', 'https://app.notion.com/icons/gray-link.svg']
  ])('maps the built-in path %s to app.notion.com', (source, expected) => {
    expect(defaultMapImageUrl(source, imageBlock)).toBe(expected)
  })

  test.each(['/images/page-cover/solid_red.png', '/icons/gray-link.svg'])(
    're-homes the absolute legacy Notion asset %s',
    (pathname) => {
      expect(
        defaultMapImageUrl(`https://www.notion.so${pathname}`, imageBlock)
      ).toBe(`https://app.notion.com${pathname}`)
    }
  )

  test('preserves an external URL', () => {
    const source = 'https://images.unsplash.com/photo.jpg?auto=format'

    expect(defaultMapImageUrl(source, imageBlock)).toBe(source)
  })

  test('preserves an opaque img.notionusercontent.com URL', () => {
    const source =
      'https://img.notionusercontent.com/s3/prod-files-secure%2Fspace-id%2Ffile-id%2Fimage.png/size/w=2000?exp=1&sig=token&id=block-id&table=block'

    expect(defaultMapImageUrl(source, imageBlock)).toBe(source)
  })

  test('re-homes a legacy Notion image proxy without retaining old query data', () => {
    expect.hasAssertions()

    const privateSource = 'attachment:file-id:image.png'
    const source = `https://www.notion.so/image/${encodeURIComponent(
      privateSource
    )}?table=space&id=stale-id&cache=legacy`

    expectStableNotionProxy(
      defaultMapImageUrl(source, imageBlock),
      privateSource
    )
  })

  test('normalizes undashed block IDs required by the image proxy', () => {
    const undashedBlock = {
      ...imageBlock,
      id: '30bedb27f12481afad6fd52af5294891'
    } as unknown as Block
    const mappedUrl = new URL(
      defaultMapImageUrl('attachment:file-id:image.png', undashedBlock)!
    )

    expect(mappedUrl.searchParams.get('id')).toBe(
      '30bedb27-f124-81af-ad6f-d52af5294891'
    )
  })

  test.each(['space', 'collection', 'team'] as const)(
    'normalizes the %s parent table to a block permission record',
    (parentTable) => {
      const block = {
        ...imageBlock,
        parent_table: parentTable
      } as Block
      const mappedUrl = new URL(
        defaultMapImageUrl('attachment:file-id:image.png', block)!
      )

      expect(mappedUrl.searchParams.get('table')).toBe('block')
    }
  )

  test('is idempotent for a current Notion proxy URL', () => {
    const mappedUrl = defaultMapImageUrl(
      'attachment:file-id:image.png',
      imageBlock
    )

    expect(defaultMapImageUrl(mappedUrl, imageBlock)).toBe(mappedUrl)
  })
})

describe('getPageImageUrls', () => {
  test.each([
    {
      name: 'file.notion.com signed URL',
      expiredSignedUrl:
        'https://file.notion.com/f/f/space-id/file-id/image.png?table=block&id=block-id&spaceId=space-id&expirationTimestamp=1&signature=expired'
    },
    {
      name: 'img.notionusercontent.com tokenized URL',
      expiredSignedUrl:
        'https://img.notionusercontent.com/s3/prod-files-secure%2Fspace-id%2Ffile-id%2Fimage.png/size/w=2000?exp=1&sig=expired&id=block-id&table=block'
    }
  ])(
    'does not emit an expired $name from a cached record map',
    ({ expiredSignedUrl }) => {
      const source = 'attachment:file-id:image.png'
      const block = {
        ...imageBlock,
        properties: {
          source: [[source]]
        }
      } as Block
      const recordMap = {
        block: {
          'page-id': {
            role: 'reader',
            value: {
              id: 'page-id',
              type: 'page',
              parent_table: 'space',
              format: {},
              permissions: [{ role: 'reader', type: 'public_permission' }]
            }
          },
          [block.id]: {
            role: 'reader',
            value: block
          }
        },
        collection: {},
        collection_view: {},
        notion_user: {},
        collection_query: {},
        signed_urls: {
          [source]: expiredSignedUrl
        }
      } as ExtendedRecordMap

      const imageUrls = getPageImageUrls(recordMap, {
        mapImageUrl: defaultMapImageUrl
      })

      expect(imageUrls).toHaveLength(1)
      expect(imageUrls).not.toContain(expiredSignedUrl)
      expectStableNotionProxy(imageUrls[0], 'attachment:file-id:image.png')
    }
  )

  test('ignores expired signatures for every image carrier', () => {
    const imageSource = 'attachment:image-id:image.png'
    const pageCover = 'attachment:cover-id:cover.png'
    const pageIcon = 'attachment:icon-id:icon.png'
    const bookmarkCover = 'attachment:bookmark-cover-id:cover.png'
    const bookmarkIcon = 'attachment:bookmark-icon-id:icon.png'
    const pageBlock = {
      id: 'page-id',
      type: 'page',
      parent_table: 'space',
      format: {
        page_cover: pageCover,
        page_icon: pageIcon
      },
      permissions: [{ role: 'reader', type: 'public_permission' }]
    } as unknown as Block
    const bookmarkBlock = {
      id: 'bookmark-id',
      type: 'bookmark',
      parent_id: pageBlock.id,
      parent_table: 'block',
      format: {
        bookmark_cover: bookmarkCover,
        bookmark_icon: bookmarkIcon
      }
    } as unknown as Block
    const block = {
      ...imageBlock,
      properties: {
        source: [[imageSource]]
      }
    } as Block
    const originalSources = [
      pageCover,
      pageIcon,
      bookmarkCover,
      bookmarkIcon,
      imageSource
    ]
    const recordMap = {
      block: {
        [pageBlock.id]: { role: 'reader', value: pageBlock },
        [bookmarkBlock.id]: { role: 'reader', value: bookmarkBlock },
        [block.id]: { role: 'reader', value: block }
      },
      collection: {},
      collection_view: {},
      notion_user: {},
      collection_query: {},
      signed_urls: Object.fromEntries(
        originalSources.map((source) => [
          source,
          `https://file.notion.com/expired/${encodeURIComponent(source)}`
        ])
      )
    } as ExtendedRecordMap
    const imageUrls = getPageImageUrls(recordMap, {
      mapImageUrl: defaultMapImageUrl
    })

    expect(
      imageUrls.map((imageUrl) => {
        const url = new URL(imageUrl)
        return {
          source: decodeURIComponent(url.pathname.slice('/image/'.length)),
          id: url.searchParams.get('id')
        }
      })
    ).toEqual([
      { source: pageCover, id: pageBlock.id },
      { source: pageIcon, id: pageBlock.id },
      { source: bookmarkCover, id: bookmarkBlock.id },
      { source: bookmarkIcon, id: bookmarkBlock.id },
      { source: imageSource, id: block.id }
    ])
    expect(imageUrls.every((imageUrl) => !imageUrl.includes('/expired/'))).toBe(
      true
    )
  })

  test('resolves public and private images independently in a mixed map', () => {
    const rootId = '11111111-1111-4111-8111-111111111111'
    const publicImageId = '22222222-2222-4222-8222-222222222222'
    const privatePageId = '33333333-3333-4333-8333-333333333333'
    const privateImageId = '44444444-4444-4444-8444-444444444444'
    const publicSource = 'attachment:public-id:public.png'
    const privateSource = 'attachment:private-id:private.png'
    const publicSignedUrl =
      'https://file.notion.com/f/f/space/public-id/public.png?expirationTimestamp=4102444800000&signature=public'
    const privateSignedUrl =
      'https://file.notion.com/f/f/space/private-id/private.png?expirationTimestamp=4102444800000&signature=private'
    const recordMap = {
      block: {
        [rootId]: {
          role: 'reader',
          value: {
            id: rootId,
            type: 'page',
            parent_table: 'space',
            format: {},
            permissions: [{ role: 'reader', type: 'public_permission' }]
          }
        },
        [publicImageId]: {
          role: 'reader',
          value: {
            id: publicImageId,
            type: 'image',
            parent_id: rootId,
            parent_table: 'block',
            properties: { source: [[publicSource]] }
          }
        },
        [privatePageId]: {
          role: 'reader',
          value: {
            id: privatePageId,
            type: 'page',
            parent_table: 'space',
            format: {},
            permissions: [{ role: 'reader', type: 'user_permission' }]
          }
        },
        [privateImageId]: {
          role: 'reader',
          value: {
            id: privateImageId,
            type: 'image',
            parent_id: privatePageId,
            parent_table: 'block',
            properties: { source: [[privateSource]] }
          }
        }
      },
      collection: {},
      collection_view: {},
      notion_user: {},
      collection_query: {},
      signed_urls: {
        [publicSource]: publicSignedUrl,
        [publicImageId]: publicSignedUrl,
        [privateSource]: privateSignedUrl,
        [privateImageId]: privateSignedUrl
      }
    } as unknown as ExtendedRecordMap

    const imageUrls = getPageImageUrls(recordMap, {
      mapImageUrl: defaultMapImageUrl
    })

    expect(imageUrls[0]).not.toBe(publicSignedUrl)
    const publicImageUrl = new URL(imageUrls[0]!)
    expect(publicImageUrl.origin).toBe('https://app.notion.com')
    expect(
      decodeURIComponent(publicImageUrl.pathname.slice('/image/'.length))
    ).toBe(publicSource)
    expect(publicImageUrl.searchParams.get('id')).toBe(publicImageId)
    expect(imageUrls[1]).toBe(privateSignedUrl)
  })
})
