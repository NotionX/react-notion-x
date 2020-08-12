import ky from 'ky-universal'
import { parsePageId } from 'notion-utils'
import * as notion from 'notion-types'
import * as types from './types'

interface NotionAPIOptions {
  apiBaseUrl?: string
  authToken?: string

  userLocale?: string
  userTimeZone?: string
}

export class NotionAPI {
  private readonly _apiBaseUrl: string
  private readonly _authToken?: string
  private readonly _userLocale: string
  private readonly _userTimeZone: string

  constructor(opts: NotionAPIOptions = {}) {
    this._apiBaseUrl = opts.apiBaseUrl || 'https://www.notion.so/api/v3'
    this._authToken = opts.authToken
    this._userLocale = opts.userLocale || 'en'
    this._userTimeZone = opts.userTimeZone || 'America/New_York'
  }

  public async getPage(pageId: string): Promise<types.RecordMap> {
    const page = await this.getPageRaw(pageId)
    const baseBlocks = page.recordMap.block

    let allBlocks = baseBlocks

    // fetch any missing content blocks
    while (true) {
      const pendingBlocks = Object.keys(allBlocks).flatMap((blockId) => {
        const block = allBlocks[blockId]
        const content = block.value && block.value.content

        return content && block.value.type !== 'page'
          ? content.filter((id: string) => !allBlocks[id])
          : []
      })

      if (!pendingBlocks.length) {
        break
      }

      const newBlocks = await this.getBlocks(pendingBlocks).then(
        (res) => res.recordMap.block
      )

      allBlocks = { ...allBlocks, ...newBlocks }
    }

    // const allCollectionInstances = Object.keys(allBlocks).flatMap((blockId) => {
    //   const block = allBlocks[blockId]

    //   // only return the first view for this collection
    //   if (block.value.type === 'collection_view') {
    //     const value = block.value

    //     return value.view_ids.map((collectionViewId) => ({
    //       id: value.id,
    //       collectionId: value.collection_id,
    //       collectionViewId
    //     }))
    //   } else {
    //     return []
    //   }
    // })

    // for (const collectionInstance of allCollectionInstances) {
    //   const { id, collectionId, collectionViewId } = collectionInstance
    //   const collection = page.recordMap.collection[collectionId]

    //   const { rows, schema } = await this.getCollectionData(
    //     collection,
    //     collectionViewId
    //   )

    //   const viewIds = allBlocks[id].value.view_ids!

    //   allBlocks[id] = {
    //     ...allBlocks[id],
    //     collection: {
    //       title: collection.value.name,
    //       schema,
    //       views: viewIds
    //         .map((id) => {
    //           const col = page.recordMap.collection_view[id]
    //           return col ? col.value : undefined
    //         })
    //         .filter(Boolean),
    //       data: rows
    //     }
    //   }
    // }

    page.recordMap.block = allBlocks
    return page.recordMap
  }

  public async getPageRaw(pageId: string) {
    const parsedPageId = parsePageId(pageId)

    if (!parsedPageId) {
      throw new Error(`invalid notion pageId "${pageId}"`)
    }

    return this.fetch<types.PageChunk>({
      endpoint: 'loadPageChunk',
      body: {
        pageId: parsedPageId,
        limit: 999,
        cursor: { stack: [] },
        chunkNumber: 0,
        verticalColumns: false
      }
    })
  }

  public async getCollectionData(
    collectionId: string,
    collectionViewId: string,
    collectionType: string = 'table'
  ) {
    return this.fetch<types.CollectionData>({
      endpoint: 'queryCollection',
      body: {
        collectionId,
        collectionViewId,
        query: { aggregations: [{ property: 'title', aggregator: 'count' }] },
        loader: {
          type: collectionType,
          limit: 999,
          searchQuery: '',
          userTimeZone: this._userTimeZone,
          userLocale: this._userLocale,
          loadContentCover: true
        }
      }
    })
  }

  public async getUsers(userIds: string[]) {
    return this.fetch<types.RecordValues<notion.User>>({
      endpoint: 'getRecordValues',
      body: {
        requests: userIds.map((id) => ({ id, table: 'notion_user' }))
      }
    })
  }

  public async getBlocks(blockIds: string[]) {
    return this.fetch<types.PageChunk>({
      endpoint: 'syncRecordValues',
      body: {
        recordVersionMap: {
          block: blockIds.reduce(
            (acc, blockId) => ({
              ...acc,
              [blockId]: -1
            }),
            {}
          )
        }
      }
    })
  }

  public async search(params: types.NotionSearchParams) {
    return this.fetch<types.NotionSearchResults>({
      endpoint: 'search',
      body: {
        type: 'BlocksInAncestor',
        source: 'quick_find_public',
        ancestorId: params.ancestorId,
        filters: {
          isDeletedOnly: false,
          excludeTemplates: true,
          isNavigableOnly: true,
          requireEditPermissions: false,
          ancestors: [],
          createdBy: [],
          editedBy: [],
          lastEditedTime: {},
          createdTime: {},
          ...params.filters
        },
        sort: 'Relevance',
        limit: params.limit || 20,
        query: params.query
      }
    })
  }

  public async fetch<T>({
    endpoint,
    body
  }: {
    endpoint: string
    body: object
  }): Promise<T> {
    const headers: any = {}

    if (this._authToken) {
      headers.cookie = `token_v2=${this._authToken}`
    }

    return ky
      .post(endpoint, {
        prefixUrl: this._apiBaseUrl,
        json: body,
        headers
      })
      .json()
  }
}
