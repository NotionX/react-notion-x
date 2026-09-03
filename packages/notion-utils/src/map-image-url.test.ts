import { type Block } from 'notion-types'
import { describe, expect, test } from 'vitest'

import {
  defaultMapImageUrl,
  getNotionFileUrl,
  getStableNotionFileSource,
  getSignedFileUrl,
  isNotionFileUrlExpired,
  isNotionSignedFileUrl
} from './map-image-url'

const legacySource =
  'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/file-id/image.png'
const signedSource =
  'https://file.notion.com/f/f/space-id/file-id/image.png?table=block&id=block-id&spaceId=space-id&expirationTimestamp=4102444800000&signature=signature'

const imageBlock = {
  id: 'block-id',
  type: 'image',
  parent_table: 'block',
  properties: {
    source: [[legacySource]]
  }
} as Block

describe('defaultMapImageUrl', () => {
  test('canonicalizes an unexpired current signed file URL', () => {
    const mappedUrl = new URL(defaultMapImageUrl(signedSource, imageBlock)!)

    expect(decodeURIComponent(mappedUrl.pathname.slice('/image/'.length))).toBe(
      'attachment:file-id:image.png'
    )
  })

  test('recovers a stable source from an expired current signed file URL', () => {
    const expiredSource = signedSource.replace('4102444800000', '1')
    const mappedUrl = new URL(defaultMapImageUrl(expiredSource, imageBlock)!)

    expect(mappedUrl.origin).toBe('https://app.notion.com')
    expect(decodeURIComponent(mappedUrl.pathname.slice('/image/'.length))).toBe(
      'attachment:file-id:image.png'
    )
  })

  test('uses external image URLs directly', () => {
    const bookmarkImage =
      'https://github.githubassets.com/images/modules/open_graph/github-logo.png'

    expect(defaultMapImageUrl(bookmarkImage, imageBlock)).toBe(bookmarkImage)
  })

  test('removes legacy S3 signatures when their expiry is unknown', () => {
    const signedLegacySource = `${legacySource}?X-Amz-Credential=credential&X-Amz-Signature=signature`
    const mappedUrl = new URL(
      defaultMapImageUrl(signedLegacySource, imageBlock)!
    )

    expect(decodeURIComponent(mappedUrl.pathname.slice('/image/'.length))).toBe(
      legacySource
    )
  })

  test('removes expired temporary signatures from legacy S3 URLs', () => {
    const signedLegacySource = `${legacySource}?X-Amz-Date=20200101T000000Z&X-Amz-Expires=60&X-Amz-Credential=credential&X-Amz-Signature=signature`
    const mappedUrl = new URL(
      defaultMapImageUrl(signedLegacySource, imageBlock)!
    )

    expect(decodeURIComponent(mappedUrl.pathname.slice('/image/'.length))).toBe(
      legacySource
    )
  })

  test('falls back to the Notion proxy for unsigned legacy file URLs', () => {
    const mappedUrl = new URL(defaultMapImageUrl(legacySource, imageBlock)!)

    expect(mappedUrl.origin).toBe('https://app.notion.com')
    expect(decodeURIComponent(mappedUrl.pathname.slice('/image/'.length))).toBe(
      legacySource
    )
    expect(mappedUrl.searchParams.get('table')).toBe('block')
    expect(mappedUrl.searchParams.get('id')).toBe(imageBlock.id)
    expect(mappedUrl.searchParams.get('cache')).toBe('v2')
  })

  test('falls back to the Notion proxy for unresolved attachment URLs', () => {
    const attachmentUrl = 'attachment:file-id:image.png'
    const mappedUrl = new URL(defaultMapImageUrl(attachmentUrl, imageBlock)!)

    expect(decodeURIComponent(mappedUrl.pathname.slice('/image/'.length))).toBe(
      attachmentUrl
    )
  })

  test('uses Notion static image paths directly', () => {
    expect(
      defaultMapImageUrl(
        '/images/page-cover/met_william_morris_1877.jpg',
        imageBlock
      )
    ).toBe(
      'https://app.notion.com/images/page-cover/met_william_morris_1877.jpg'
    )
  })
})

describe('Notion file URL helpers', () => {
  test.each([
    legacySource,
    signedSource,
    'https://file.notion.so/f/f/space-id/file-id/image.png?signature=test',
    'https://prod-files-secure.s3.us-west-2.amazonaws.com/file-id/image.png',
    'attachment:file-id:image.png'
  ])('recognizes private Notion file URL %s without changing it', (url) => {
    expect(getNotionFileUrl(url)).toBe(url)
  })

  test.each([
    signedSource,
    'https://file.notion.so/f/f/space-id/file-id/image.png?signature=test'
  ])('recovers a stable attachment source from temporary URL %s', (url) => {
    expect(getStableNotionFileSource(url)).toBe('attachment:file-id:image.png')
  })

  test.each([
    'https://images.unsplash.com/image.jpg',
    'https://img.notionusercontent.com/s3/prod-files-secure/image.jpg',
    'https://github.com/favicon.ico'
  ])('does not treat directly usable image URL %s as a private file', (url) => {
    expect(getNotionFileUrl(url)).toBeUndefined()
  })

  test('extracts attachment URLs from legacy Notion proxy URLs', () => {
    const attachmentUrl = 'attachment:file-id:image.png'
    const proxyUrl = defaultMapImageUrl(attachmentUrl, imageBlock)!

    expect(getNotionFileUrl(proxyUrl)).toBe(attachmentUrl)
  })

  test('resolves signatures by source URL', () => {
    expect(
      getSignedFileUrl(legacySource, imageBlock, {
        [legacySource]: signedSource
      })
    ).toBe(signedSource)
  })

  test('supports block-keyed signatures from older record maps', () => {
    expect(
      getSignedFileUrl(legacySource, imageBlock, {
        [imageBlock.id]: signedSource
      })
    ).toBe(signedSource)
  })

  test('resolves legacy Notion proxy URLs using their underlying file URL', () => {
    const attachmentUrl = 'attachment:file-id:image.png'
    const proxyUrl = defaultMapImageUrl(attachmentUrl, imageBlock)!

    expect(
      getSignedFileUrl(proxyUrl, imageBlock, {
        [attachmentUrl]: signedSource
      })
    ).toBe(signedSource)
  })

  test("resolves old maps keyed by a proxy URL's raw inner file URL", () => {
    const proxyUrl = `https://www.notion.so/image/${encodeURIComponent(
      signedSource
    )}?table=block&id=${imageBlock.id}&cache=v2`
    const refreshedSignedSource = signedSource.replace(
      'signature=signature',
      'signature=refreshed'
    )

    expect(
      getSignedFileUrl(proxyUrl, imageBlock, {
        [signedSource]: refreshedSignedSource
      })
    ).toBe(refreshedSignedSource)
  })

  test('does not use a page cover signature for its icon', () => {
    const cover = 'attachment:cover-id:cover.png'
    const icon = 'attachment:icon-id:icon.png'
    const pageBlock = {
      id: 'page-id',
      type: 'page',
      parent_table: 'block',
      format: {
        page_cover: cover,
        page_icon: icon
      }
    } as Block

    expect(
      getSignedFileUrl(icon, pageBlock, {
        [pageBlock.id]: 'https://file.notion.com/signed-cover'
      })
    ).toBe(icon)
  })
})

describe('Notion file URL expiration', () => {
  const now = 2_000_000_000_000

  test.each([
    ['millisecond expiration', `expirationTimestamp=${now}`, true],
    ['future millisecond expiration', `expirationTimestamp=${now + 1}`, false],
    ['second expiration', 'expirationTimestamp=2000000000', true],
    ['CloudFront expiration', 'Expires=2000000000', true],
    ['image CDN expiration', 'exp=2000000000', true],
    [
      'expired AWS V4 signature',
      'X-Amz-Date=20200101T000000Z&X-Amz-Expires=60',
      true
    ],
    [
      'future AWS V4 signature',
      'X-Amz-Date=20350101T000000Z&X-Amz-Expires=60',
      false
    ],
    [
      'malformed AWS V4 signature',
      'X-Amz-Date=20209999T999999Z&X-Amz-Expires=60',
      false
    ],
    ['missing expiration', 'signature=value', false]
  ])('%s', (_name, query, expected) => {
    expect(
      isNotionFileUrlExpired(`https://file.notion.com/file?${query}`, now)
    ).toBe(expected)
  })

  test.each([
    'https://file.notion.com/f/f/space/file/image.png?signature=value',
    'https://img.notionusercontent.com/image?exp=2000000000&sig=value',
    `${legacySource}?X-Amz-Signature=value`
  ])('recognizes signed URL %s', (url) => {
    expect(isNotionSignedFileUrl(url)).toBe(true)
  })
})
