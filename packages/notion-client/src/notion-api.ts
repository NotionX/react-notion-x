import got from 'got'
import pMap from 'p-map'
import { parsePageId } from 'notion-utils'
import * as notion from 'notion-types'

export class NotionAPI {
  private readonly _apiBaseUrl: string
  private readonly _authToken?: string
  private readonly _userLocale: string
  private readonly _userTimeZone: string

  constructor({
    apiBaseUrl = 'https://www.notion.so/api/v3',
    authToken,
    userLocale = 'en',
    userTimeZone = 'America/New_York'
  }: {
    apiBaseUrl?: string
    authToken?: string
    userLocale?: string
    userTimeZone?: string
  } = {}) {
    this._apiBaseUrl = apiBaseUrl
    this._authToken = authToken
    this._userLocale = userLocale
    this._userTimeZone = userTimeZone
  }

  public async getPage(
    pageId: string,
    {
      concurrency = 2,
      fetchCollections = true
    }: { concurrency?: number; fetchCollections?: boolean } = {}
  ): Promise<notion.ExtendedRecordMap> {
    console.log('getPageRaw', pageId)
    const page = await this.getPageRaw(pageId)
    const recordMap: notion.ExtendedRecordMap = page.recordMap
    recordMap.collection_query = {}

    console.log('getPage', pageId)

    // fetch any missing content blocks
    while (true) {
      const pendingBlocks = Object.keys(recordMap.block).flatMap((blockId) => {
        const block = recordMap.block[blockId]
        const content = block.value && block.value.content

        return content && block.value.type !== 'page'
          ? content.filter((id) => !recordMap.block[id])
          : []
      })

      if (!pendingBlocks.length) {
        break
      }

      console.log('getBlocks', pendingBlocks)
      const newBlocks = await this.getBlocks(pendingBlocks).then(
        (res) => res.recordMap.block
      )

      recordMap.block = { ...recordMap.block, ...newBlocks }
    }

    if (fetchCollections) {
      const allCollectionInstances = Object.keys(recordMap.block).flatMap(
        (blockId) => {
          const block = recordMap.block[blockId]

          if (block.value.type === 'collection_view') {
            const value = block.value

            return value.view_ids.map((collectionViewId) => ({
              collectionId: value.collection_id,
              collectionViewId
            }))
          } else {
            return []
          }
        }
      )

      console.log('allCollectionInstances', allCollectionInstances)

      // fetch data for all collection view instances
      await pMap(
        allCollectionInstances,
        async (collectionInstance) => {
          const { collectionId, collectionViewId } = collectionInstance
          const collectionData = await this.getCollectionData(
            collectionId,
            collectionViewId
          )

          recordMap.block = {
            ...recordMap.block,
            ...collectionData.recordMap.block
          }

          recordMap.notion_user = {
            ...recordMap.notion_user,
            ...collectionData.recordMap.notion_user
          }

          recordMap.collection_query![collectionId] = {
            ...recordMap.collection_query![collectionId],
            [collectionViewId]: collectionData.result
          }
        },
        {
          concurrency
        }
      )
    }

    return recordMap
  }

  public async getPageRaw(pageId: string) {
    const parsedPageId = parsePageId(pageId)

    if (!parsedPageId) {
      throw new Error(`invalid notion pageId "${pageId}"`)
    }

    return this.fetch<notion.PageChunk>({
      endpoint: 'loadPageChunk',
      body: {
        pageId: parsedPageId,
        limit: 999999,
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
    return this.fetch<notion.CollectionInstance>({
      endpoint: 'queryCollection',
      body: {
        collectionId,
        collectionViewId,
        query: { aggregations: [{ property: 'title', aggregator: 'count' }] },
        loader: {
          type: collectionType,
          limit: 999999,
          searchQuery: '',
          userTimeZone: this._userTimeZone,
          userLocale: this._userLocale,
          loadContentCover: true
        }
      }
    })
  }

  public async getUsers(userIds: string[]) {
    return this.fetch<notion.RecordValues<notion.User>>({
      endpoint: 'getRecordValues',
      body: {
        requests: userIds.map((id) => ({ id, table: 'notion_user' }))
      }
    })
  }

  public async getBlocks(blockIds: string[]) {
    return this.fetch<notion.PageChunk>({
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

  public async search(params: notion.SearchParams) {
    return this.fetch<notion.SearchResults>({
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

    return got
      .post(endpoint, {
        prefixUrl: this._apiBaseUrl,
        json: body,
        headers
      })
      .json()
  }
}
