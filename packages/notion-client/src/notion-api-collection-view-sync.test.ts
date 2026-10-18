import { getBlockValue } from 'notion-utils'
import { afterEach, expect, test, vi } from 'vitest'

import { NotionAPI } from './notion-api'

// A `collection_view` record only arrives with the page chunk, and `getPage`
// fetches chunk 0 only; a database block beyond it is loaded through
// `getBlocks` (blocks only) and `queryCollection` does not return the view,
// so `recordMap.collection_view` stays `{}`. `getPage` now syncs whatever is
// missing before querying each collection.
//
// The fixture is the "Child Collection Views" page of the Notion Test Suite
// (`067dd719a912471ea9a3ac10710e7fdf`, already in notion-api.test.ts): a table
// database inside a toggle, so the toggle's children are not in chunk 0.

const pageId = '6faa607a-8549-462c-985d-eec153047d27'
const collectionViewBlockId = '7a894c56-2a57-40c1-9297-41d866f4d60e'
const collectionViewId = '7ef433b2-a1c8-48d2-9f7e-ca69087f450a'

afterEach(() => {
  vi.restoreAllMocks()
})

test(
  'NotionAPI.getPage syncs a collection_view that is missing from the page chunk',
  { timeout: 120_000 },
  async () => {
    const api = new NotionAPI()

    // Precondition: the database block and its view are not in chunk 0.
    const chunk = await api.getPageRaw(pageId)
    expect(chunk.recordMap.block[collectionViewBlockId]).toBeUndefined()
    expect(chunk.recordMap.collection_view?.[collectionViewId]).toBeUndefined()

    const recordMap = await api.getPage(pageId, {
      signFileUrls: false,
      throwOnCollectionErrors: true
    })

    const block = getBlockValue(recordMap.block[collectionViewBlockId])
    expect(block?.type).toBe('collection_view')
    if (block?.type !== 'collection_view') {
      throw new Error('unreachable')
    }
    expect(block.view_ids).toContain(collectionViewId)

    const view = getBlockValue(recordMap.collection_view[collectionViewId])
    expect(view?.type).toBe('table')
    expect(view?.parent_id).toBe(collectionViewBlockId)

    const query = recordMap.collection_query[block.collection_id!]
    expect(
      query?.[collectionViewId]?.collection_group_results?.blockIds.length
    ).toBeGreaterThan(0)
  }
)

test('NotionAPI.getPage logs a warning and keeps going when the sync fails', async () => {
  const api = new NotionAPI()
  const toggleId = '3d0087da-7916-440e-b0e2-f74ba0971c4a'
  const collectionId = '44aa3e25-d811-4849-9c2e-771199d853fe'
  const spaceId = 'fde5ac74-eea3-4527-8f00-4482710e1af3'

  vi.spyOn(api, 'getPageRaw').mockResolvedValue({
    recordMap: {
      block: {
        [pageId]: {
          role: 'reader',
          value: {
            id: pageId,
            type: 'page',
            content: [toggleId],
            space_id: spaceId
          }
        },
        [toggleId]: {
          role: 'reader',
          value: {
            id: toggleId,
            type: 'toggle',
            content: [collectionViewBlockId],
            space_id: spaceId,
            parent_id: pageId,
            parent_table: 'block'
          }
        },
        [collectionViewBlockId]: {
          role: 'reader',
          value: {
            id: collectionViewBlockId,
            type: 'collection_view',
            view_ids: [collectionViewId],
            collection_id: collectionId,
            space_id: spaceId,
            parent_id: toggleId,
            parent_table: 'block'
          }
        }
      },
      collection: {
        [collectionId]: { role: 'reader', value: { id: collectionId } }
      },
      collection_view: {}
    }
  } as never)
  vi.spyOn(api, 'fetch').mockRejectedValue(new Error('sync boom'))
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const collectionDataSpy = vi
    .spyOn(api, 'getCollectionData')
    .mockResolvedValue({
      recordMap: {
        block: {},
        collection: {},
        collection_view: {},
        notion_user: {}
      },
      result: { reducerResults: {} }
    } as never)

  const recordMap = await api.getPage(pageId, { signFileUrls: false })

  expect(warnSpy).toHaveBeenCalledWith(
    'NotionAPI collection view sync error',
    expect.objectContaining({ pageId, collectionViewIds: [collectionViewId] }),
    'sync boom'
  )
  expect(collectionDataSpy).toHaveBeenCalledTimes(1)
  expect(recordMap.collection_view[collectionViewId]).toBeUndefined()
})
