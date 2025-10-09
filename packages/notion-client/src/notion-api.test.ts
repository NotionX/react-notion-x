import { expect, test, vi } from 'vitest'

import { NotionAPI } from './notion-api'

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
  'https://www.notion.so/potionsite/newest-board-a899b98b7cdc424585e5ddebbdae60cc'

  // collections stress test
  // NOTE: removing because of sporadic timeouts
  // 'nba-3f92ae505636427c897634a15b9f2892'
]

const pageIdFixturesFailure = [
  'bdecdf150d0e40cb9f3412be132335d4', // private page
  'foo' // invalid page id
]

for (const pageId of pageIdFixturesSuccess) {
  test(
    `NotionAPI.getPage success ${pageId}`,
    {
      timeout: 60_000 // one minute timeout
    },
    async () => {
      const api = new NotionAPI()
      const page = await api.getPage(pageId, { throwOnCollectionErrors: true })

      expect(page).toBeTruthy()
      expect(page.block).toBeTruthy()
    }
  )
}

for (const pageId of pageIdFixturesFailure) {
  test(`NotionAPI.getPage failure ${pageId}`, async () => {
    const api = new NotionAPI()
    await expect(() => api.getPage(pageId)).rejects.toThrow()
  })
}

test('NotionAPI.getPage should log a helpful error on 530 errors', async () => {
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {})

  const pageId = 'bdecdf15-0d0e-40cb-9f34-12be132335d4' // Use a valid UUID format
  const collectionId = 'collection-id'
  const viewId = 'view-id'

  const api = new NotionAPI()

  // Spy on the private fetch method to isolate the mock to this test
  const fetchSpy = vi
    .spyOn(api as any, 'fetch')
    .mockImplementation(async (params: any) => {
      const { endpoint } = params
      if (endpoint === 'loadPageChunk') {
        return {
          recordMap: {
            block: {
              [pageId]: {
                value: {
                  id: pageId,
                  type: 'collection_view_page',
                  collection_id: collectionId,
                  view_ids: [viewId]
                }
              }
            },
            collection: {
              [collectionId]: {
                value: { id: collectionId, name: [['Test Collection']] }
              }
            },
            collection_view: {
              [viewId]: {
                value: { id: viewId, type: 'table' }
              }
            }
          }
        }
      }

      if (endpoint === 'queryCollection') {
        const error: any = new Error('Response code 530')
        error.status = 530
        error.response = { status: 530 }
        throw error
      }

      return {}
    })

  const page = await api.getPage(pageId, {
    fetchCollections: true,
    throwOnCollectionErrors: false
  })

  expect(page).toBeTruthy()
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.stringContaining('Notion API Error 530: Collection query failed')
  )
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    expect.stringContaining(
      "Solution: Configure NotionAPI with your site's subdomain"
    )
  )

  fetchSpy.mockRestore()
  consoleErrorSpy.mockRestore()
})
