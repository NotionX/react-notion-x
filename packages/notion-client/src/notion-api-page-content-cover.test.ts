import { getBlockValue } from 'notion-utils'
import { afterEach, expect, test, vi } from 'vitest'

import { NotionAPI } from './notion-api'

// `queryCollection` with `loadContentCover` returns only the first few content
// blocks of each row page (8 observed on a public gallery: rows with 22, 21
// and 11 children all came back with exactly 8). A gallery or board whose
// cover is `page_content` renders the row's first image block, so a row whose
// first image sits past that prefix gets an empty cover although the id is in
// `content`. `getPage` now fetches the next slice of each such row's unloaded
// content in one `syncRecordValuesMain` call.
//
// No public fixture has a row whose first image sits past the prefix, so the
// cutoff is modelled here: `getPageRaw` and `getCollectionData` are stubbed
// and `getBlocks` is spied on.

const pageId = 'a0000000-0000-4000-8000-000000000001'
const collectionViewBlockId = 'a0000000-0000-4000-8000-000000000002'
const collectionViewId = 'a0000000-0000-4000-8000-000000000003'
const collectionId = 'a0000000-0000-4000-8000-000000000004'
const spaceId = 'a0000000-0000-4000-8000-000000000005'

// Row A: 12 children, 8 loaded (all text), first image at index 9.
const rowAId = 'b0000000-0000-4000-8000-00000000000a'
const rowAContent = Array.from(
  { length: 12 },
  (_, i) => `c0000000-0000-4000-8000-${String(i).padStart(12, '0')}`
)
const rowAImageId = rowAContent[9]!
const rowAMissingIds = rowAContent.slice(8)

// Row B: 10 children, 8 loaded, an image inside the loaded prefix.
const rowBId = 'b0000000-0000-4000-8000-00000000000b'
const rowBContent = Array.from(
  { length: 10 },
  (_, i) => `d0000000-0000-4000-8000-${String(i).padStart(12, '0')}`
)

const record = (value: Record<string, unknown>) => ({
  role: 'reader',
  value: { space_id: spaceId, parent_table: 'block', ...value }
})

const textBlock = (id: string, parentId: string) =>
  record({ id, type: 'text', parent_id: parentId })

const imageBlock = (id: string, parentId: string) =>
  record({
    id,
    type: 'image',
    parent_id: parentId,
    properties: { source: [[`https://example.com/${id}.png`]] }
  })

function pageChunk() {
  return {
    recordMap: {
      block: {
        [pageId]: record({
          id: pageId,
          type: 'page',
          content: [collectionViewBlockId]
        }),
        [collectionViewBlockId]: record({
          id: collectionViewBlockId,
          type: 'collection_view',
          view_ids: [collectionViewId],
          collection_id: collectionId,
          parent_id: pageId
        })
      },
      collection: {
        [collectionId]: { role: 'reader', value: { id: collectionId } }
      },
      collection_view: {
        [collectionViewId]: {
          role: 'reader',
          value: {
            id: collectionViewId,
            type: 'gallery',
            parent_id: collectionViewBlockId,
            format: { gallery_cover: { type: 'page_content' } }
          }
        }
      }
    }
  }
}

function collectionData() {
  return {
    recordMap: {
      block: {
        [rowAId]: record({
          id: rowAId,
          type: 'page',
          parent_id: collectionId,
          parent_table: 'collection',
          content: rowAContent
        }),
        ...Object.fromEntries(
          rowAContent.slice(0, 8).map((id) => [id, textBlock(id, rowAId)])
        ),
        [rowBId]: record({
          id: rowBId,
          type: 'page',
          parent_id: collectionId,
          parent_table: 'collection',
          content: rowBContent
        }),
        ...Object.fromEntries(
          rowBContent
            .slice(0, 8)
            .map((id, i) => [
              id,
              i === 3 ? imageBlock(id, rowBId) : textBlock(id, rowBId)
            ])
        )
      } as Record<string, ReturnType<typeof record>>,
      collection: {},
      collection_view: {},
      notion_user: {}
    },
    result: {
      reducerResults: {
        collection_group_results: {
          type: 'results',
          blockIds: [rowAId, rowBId],
          hasMore: false
        }
      }
    }
  }
}

function stubPage(api: NotionAPI) {
  vi.spyOn(api, 'getPageRaw').mockResolvedValue(pageChunk() as never)
  vi.spyOn(api, 'getCollectionData').mockResolvedValue(
    collectionData() as never
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

test('NotionAPI.getPage fetches the unloaded content of page_content cover rows in one call', async () => {
  const api = new NotionAPI()
  stubPage(api)
  const getBlocksSpy = vi.spyOn(api, 'getBlocks').mockResolvedValue({
    recordMap: {
      block: Object.fromEntries(
        rowAMissingIds.map((id) => [
          id,
          id === rowAImageId ? imageBlock(id, rowAId) : textBlock(id, rowAId)
        ])
      )
    }
  } as never)

  const recordMap = await api.getPage(pageId, { signFileUrls: false })

  // One batched call, carrying only row A's unloaded ids: row B already has
  // an image in its loaded prefix.
  expect(getBlocksSpy).toHaveBeenCalledTimes(1)
  expect(getBlocksSpy.mock.calls[0]![0]).toEqual(rowAMissingIds)

  expect(getBlockValue(recordMap.block[rowAImageId])?.type).toBe('image')

  // What the collection card does: the first image id in `content` that
  // resolves to an image block.
  const rowA = getBlockValue(recordMap.block[rowAId])
  const coverBlockId = rowA?.content?.find(
    (id) => getBlockValue(recordMap.block[id])?.type === 'image'
  )
  expect(coverBlockId).toBe(rowAImageId)
})

test('NotionAPI.getPage makes no extra request when every row already has an image loaded', async () => {
  const api = new NotionAPI()
  stubPage(api)
  const data = collectionData()
  data.recordMap.block[rowAContent[2]!] = imageBlock(rowAContent[2]!, rowAId)
  vi.spyOn(api, 'getCollectionData').mockResolvedValue(data as never)
  const getBlocksSpy = vi.spyOn(api, 'getBlocks')

  await api.getPage(pageId, { signFileUrls: false })

  expect(getBlocksSpy).not.toHaveBeenCalled()
})

test('NotionAPI.getPage logs a warning and keeps going when the cover sync fails', async () => {
  const api = new NotionAPI()
  stubPage(api)
  vi.spyOn(api, 'getBlocks').mockRejectedValue(new Error('sync boom'))
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  const recordMap = await api.getPage(pageId, { signFileUrls: false })

  expect(warnSpy).toHaveBeenCalledWith(
    'NotionAPI page content cover sync error',
    expect.objectContaining({ pageId, blockIds: rowAMissingIds }),
    'sync boom'
  )
  expect(recordMap.block[rowAImageId]).toBeUndefined()
  expect(getBlockValue(recordMap.block[rowAId])?.type).toBe('page')
})
