import { defaultMapImageUrl, getPageImageUrls } from 'notion-utils'
import { expect, test } from 'vitest'

import { NotionAPI } from './notion-api'

const imageRegressionPageId = '30bedb27f12481cc9d6afe0976b52e60'

const privateImageFixtures = [
  {
    source: 'attachment:e7f3a695-9dd2-440f-a398-060b2d67f783:image.png',
    ownerId: '30bedb27-f124-81af-ad6f-d52af5294891'
  },
  {
    source:
      'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3441b9fe-72df-4a84-849a-d5cfe9027c9d/background2.jpg',
    ownerId: '067dd719-a912-471e-a9a3-ac10710e7fdf'
  }
] as const

test(
  'public Notion uploads and page covers resolve through reachable stable image URLs',
  { timeout: 45_000 },
  async () => {
    const recordMap = await new NotionAPI().getPage(imageRegressionPageId, {
      fetchCollections: false
    })
    const imageUrls = getPageImageUrls(recordMap, {
      mapImageUrl: defaultMapImageUrl
    })
    const proxyUrlsBySource = new Map<string, URL>()

    for (const imageUrl of imageUrls) {
      const url = new URL(imageUrl)

      if (
        url.origin === 'https://app.notion.com' &&
        url.pathname.startsWith('/image/')
      ) {
        proxyUrlsBySource.set(
          decodeURIComponent(url.pathname.slice('/image/'.length)),
          url
        )
      }
    }

    const urlsToFetch = privateImageFixtures.map(({ source, ownerId }) => {
      const url = proxyUrlsBySource.get(source)

      expect(url).toBeDefined()
      expect(url!.origin).toBe('https://app.notion.com')
      expect(url!.pathname).toBe(`/image/${encodeURIComponent(source)}`)
      expect(Object.fromEntries(url!.searchParams)).toEqual({
        table: 'block',
        id: ownerId,
        cache: 'v2'
      })

      return url!.toString()
    })

    await Promise.all(
      urlsToFetch.map(async (url) => {
        const response = await fetch(url, {
          headers: {
            Range: 'bytes=0-0'
          },
          redirect: 'follow',
          signal: AbortSignal.timeout(20_000)
        })

        try {
          expect(response.status).toBeGreaterThanOrEqual(200)
          expect(response.status).toBeLessThan(300)
          expect(response.headers.get('content-type')).toMatch(/^image\//)
        } finally {
          await response.body?.cancel()
        }
      })
    )
  }
)
