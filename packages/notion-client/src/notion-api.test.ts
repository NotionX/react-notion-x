import { type ExtendedRecordMap } from 'notion-types'
import { getBlockValue, parsePageId } from 'notion-utils'
import { expect, test, vi } from 'vitest'

import { NotionAPI } from './notion-api'

test('NotionAPI.addSignedUrls signs every private asset in a block', async () => {
  const imageSource = 'attachment:image-id:image.png'
  const proxiedImageSource = 'attachment:proxied-image-id:proxied-image.png'
  const imageProxyUrl = `https://www.notion.so/image/${encodeURIComponent(
    proxiedImageSource
  )}?table=block&id=proxy-image-block&cache=v2`
  const pageCover = 'attachment:cover-id:cover.jpg'
  const pageIcon =
    'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/icon-id/icon.png'
  const propertyFile =
    'https://prod-files-secure.s3.us-west-2.amazonaws.com/property-id/property.png'
  const externalBookmarkImage =
    'https://github.githubassets.com/images/modules/open_graph/github-logo.png'

  const recordMap = {
    block: {
      'image-block': {
        role: 'reader',
        value: {
          id: 'image-block',
          type: 'image',
          parent_table: 'block',
          properties: {
            source: [[imageSource]]
          }
        }
      },
      'page-block': {
        role: 'reader',
        value: {
          id: 'page-block',
          type: 'page',
          parent_table: 'block',
          format: {
            page_cover: pageCover,
            page_icon: pageIcon,
            bookmark_cover: externalBookmarkImage
          },
          properties: {
            files: [['property file', [['a', propertyFile]]]]
          }
        }
      },
      'proxy-image-block': {
        role: 'reader',
        value: {
          id: 'proxy-image-block',
          type: 'image',
          parent_table: 'block',
          properties: {
            source: [[imageProxyUrl]]
          }
        }
      }
    },
    collection: {},
    collection_view: {},
    notion_user: {},
    collection_query: {},
    signed_urls: {}
  } as unknown as ExtendedRecordMap

  const api = new NotionAPI()
  const getSignedFileUrls = vi
    .spyOn(api, 'getSignedFileUrls')
    .mockImplementation(async (requests) => ({
      signedUrls: requests.map(({ url }) => `signed:${url}`)
    }))

  await api.addSignedUrls({ recordMap })

  const requests = getSignedFileUrls.mock.calls[0]![0]
  expect(requests.map(({ url }) => url)).toEqual([
    imageSource,
    pageCover,
    pageIcon,
    propertyFile,
    proxiedImageSource
  ])
  expect(recordMap.signed_urls[imageSource]).toBe(`signed:${imageSource}`)
  expect(recordMap.signed_urls['image-block']).toBe(`signed:${imageSource}`)
  expect(recordMap.signed_urls[pageCover]).toBe(`signed:${pageCover}`)
  expect(recordMap.signed_urls['page-block']).toBe(`signed:${pageCover}`)
  expect(recordMap.signed_urls[pageIcon]).toBe(`signed:${pageIcon}`)
  expect(recordMap.signed_urls[propertyFile]).toBe(`signed:${propertyFile}`)
  expect(recordMap.signed_urls[proxiedImageSource]).toBe(
    `signed:${proxiedImageSource}`
  )
  expect(recordMap.signed_urls['proxy-image-block']).toBe(
    `signed:${proxiedImageSource}`
  )
  expect(recordMap.signed_urls[externalBookmarkImage]).toBeUndefined()
})

const pageIdFixturesSuccess = [
  '78fc5a4b88d74b0e824e29407e9f1ec1',
  '067dd719-a912-471e-a9a3-ac10710e7fdf',
  '067dd719a912471ea9a3ac10710e7fdf',
  'https://www.notion.so/saasifysh/Embeds-5d4e290ca4604d8fb809af806a6c1749',
  'https://www.notion.so/saasifysh/File-Uploads-34d650c65da34f888335dbd3ddd141dc',
  'Color-Rainbow-54bf56611797480c951e5c1f96cb06f2',
  'e68c18a461904eb5a2ddc3748e76b893',
  'https://www.notion.so/saasifysh/Saasify-Key-Takeaways-689a8abc1afa4699905aa2f2e585e208',
  'https://www.notion.so/saasifysh/TransitiveBullsh-it-78fc5a4b88d74b0e824e29407e9f1ec1',
  'https://www.notion.so/saasifysh/About-8d0062776d0c4afca96eb1ace93a7538',
  'https://www.notion.so/potionsite/newest-board-a899b98b7cdc424585e5ddebbdae60cc',
  '2fea615a97a7401c81be486e4eec2e94'

  // collections stress test
  // NOTE: removing because of sporadic timeouts
  // 'nba-3f92ae505636427c897634a15b9f2892'
]

const pageIdFixturesFailure = [
  'bdecdf150d0e40cb9f3412be132335d4', // private page
  'foo' // invalid page id
]

for (const input of pageIdFixturesSuccess) {
  test(
    `NotionAPI.getPage success ${input}`,
    {
      timeout: 120_000 // one minute timeout
    },
    async () => {
      const pageId = parsePageId(input)
      if (!pageId) {
        throw new Error(`Invalid page id "${input}"`)
      }

      const api = new NotionAPI()
      const page = await api.getPage(pageId, { throwOnCollectionErrors: true })
      expect(page).toBeTruthy()
      expect(page.block).toBeTruthy()
      expect(page.block[pageId]).toBeTruthy()
      expect(getBlockValue(page.block[pageId])).toBeTruthy()
      expect(getBlockValue(page.block[pageId])?.id).toBe(pageId)
    }
  )
}

for (const pageId of pageIdFixturesFailure) {
  test(`NotionAPI.getPage failure ${pageId}`, async () => {
    const api = new NotionAPI()
    await expect(() => api.getPage(pageId)).rejects.toThrow()
  })
}
