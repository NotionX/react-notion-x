import { getBlockValue } from 'notion-utils'
import { afterEach, expect, test, vi } from 'vitest'

import { NotionAPI } from './notion-api'

// Neither `loadPageChunk` nor `queryCollection` returns `notion_user` records,
// so `recordMap.notion_user` stayed `{}` and Person properties / @user mentions
// rendered empty. `getPage` now syncs every user a block property refers to.
//
// The fixture is the "Collections" page of the Notion Test Suite
// (`067dd719a912471ea9a3ac10710e7fdf`, already in notion-api.test.ts): its
// database has a Person column referencing two users.

const pageId = '2fea615a97a7401c81be486e4eec2e94'
const personPropertyId = 'uy^('
const rowId = '43fb2254-b7e3-412c-a461-566f7a83918e'
const userIds = [
  'db401f86-4012-4d18-9445-236978ef32df',
  '3a828f9b-5a82-4ecc-9fa9-a2c27700797c'
]

afterEach(() => {
  vi.restoreAllMocks()
})

test(
  'NotionAPI.getPage syncs the notion_user records a Person property refers to',
  { timeout: 120_000 },
  async () => {
    const api = new NotionAPI()

    // Precondition: the page chunk carries no users.
    const chunk = await api.getPageRaw(pageId)
    expect(Object.keys(chunk.recordMap.notion_user ?? {})).toEqual([])

    const recordMap = await api.getPage(pageId, {
      signFileUrls: false,
      throwOnCollectionErrors: true
    })

    expect(Object.keys(recordMap.notion_user).sort()).toEqual(
      [...userIds].sort()
    )

    for (const userId of userIds) {
      const user = getBlockValue(recordMap.notion_user[userId])
      expect(user?.id).toBe(userId)
      expect(user?.profile_photo).toMatch(/^https:\/\//)
    }

    const row = getBlockValue(recordMap.block[rowId])
    expect(row?.properties?.[personPropertyId]).toEqual([
      ['‣', [['u', userIds[0]]]]
    ])
  }
)

test('NotionAPI.getPage logs a warning and keeps going when the user sync fails', async () => {
  const api = new NotionAPI()

  vi.spyOn(api, 'getPageRaw').mockResolvedValue({
    recordMap: {
      block: {
        [pageId]: {
          role: 'reader',
          value: {
            id: pageId,
            type: 'page',
            properties: {
              title: [['Hello '], ['‣', [['u', userIds[0]]]]]
            }
          }
        }
      }
    }
  } as never)
  const fetchSpy = vi
    .spyOn(api, 'fetch')
    .mockRejectedValue(new Error('sync boom'))
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  const recordMap = await api.getPage(pageId, { signFileUrls: false })

  expect(fetchSpy).toHaveBeenCalledTimes(1)
  expect(fetchSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      endpoint: 'syncRecordValuesMain',
      body: {
        requests: [
          { pointer: { table: 'notion_user', id: userIds[0] }, version: -1 }
        ]
      }
    })
  )
  expect(warnSpy).toHaveBeenCalledWith(
    'NotionAPI user sync error',
    { pageId, userIds: [userIds[0]] },
    'sync boom'
  )
  expect(recordMap.notion_user).toEqual({})
  expect(getBlockValue(recordMap.block[pageId])?.type).toBe('page')
})
