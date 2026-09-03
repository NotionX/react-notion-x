import { type ExtendedRecordMap } from 'notion-types'
import { describe, expect, test } from 'vitest'

import {
  isPublicNotionBlock,
  isPublicNotionPage
} from './is-public-notion-page'

const publicPermission = { role: 'reader', type: 'public_permission' }
const userPermission = { role: 'reader', type: 'user_permission' }

const createRecordMap = (
  blocks: Array<{
    id: string
    parentId?: string
    permissions?: Array<typeof publicPermission>
  }>
) =>
  ({
    block: Object.fromEntries(
      blocks.map(({ id, parentId = 'space-id', permissions }) => [
        id,
        {
          role: 'reader',
          value: {
            id,
            type: 'page',
            parent_id: parentId,
            parent_table: 'block',
            format: {},
            permissions
          }
        }
      ])
    ),
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {}
  }) as unknown as ExtendedRecordMap

describe('isPublicNotionPage', () => {
  test('walks from a user-only child to its public ancestor', () => {
    const childId = '11111111-1111-4111-8111-111111111111'
    const parentId = '22222222-2222-4222-8222-222222222222'
    const recordMap = createRecordMap([
      { id: childId, parentId, permissions: [userPermission] },
      { id: parentId, permissions: [publicPermission] }
    ])

    expect(isPublicNotionPage(recordMap)).toBe(true)
  })

  test('does not use an unrelated public block for a private root', () => {
    const rootId = '11111111-1111-4111-8111-111111111111'
    const recordMap = createRecordMap([
      { id: rootId, permissions: [userPermission] },
      {
        id: '22222222-2222-4222-8222-222222222222',
        permissions: [publicPermission]
      }
    ])

    expect(isPublicNotionPage(recordMap, rootId.replaceAll('-', ''))).toBe(
      false
    )
    expect(isPublicNotionBlock(recordMap, rootId)).toBe(false)
    expect(
      isPublicNotionBlock(recordMap, '22222222-2222-4222-8222-222222222222')
    ).toBe(true)
  })

  test('accepts dashed and undashed explicit root IDs', () => {
    const rootId = '11111111-1111-4111-8111-111111111111'
    const recordMap = createRecordMap([
      { id: rootId, permissions: [userPermission, publicPermission] }
    ])

    expect(isPublicNotionPage(recordMap, rootId)).toBe(true)
    expect(isPublicNotionPage(recordMap, rootId.replaceAll('-', ''))).toBe(true)
  })

  test('falls back to the first block when the requested root is missing', () => {
    const recordMap = createRecordMap([
      {
        id: '11111111-1111-4111-8111-111111111111',
        permissions: [publicPermission]
      }
    ])

    expect(isPublicNotionPage(recordMap, 'missing-root')).toBe(true)
  })

  test('finds a public root when an orphaned collection row has no permissions', () => {
    const recordMap = createRecordMap([
      { id: '11111111-1111-4111-8111-111111111111' },
      {
        id: '22222222-2222-4222-8222-222222222222',
        permissions: [publicPermission]
      }
    ])

    expect(isPublicNotionPage(recordMap)).toBe(true)
  })
})
