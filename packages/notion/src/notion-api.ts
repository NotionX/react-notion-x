import ky from 'ky'

import * as notion from 'notion-types'
import * as types from './types'

class NotionAPIOptions {
  apiBaseUrl: string = 'https://www.notion.so/api/v3'
  authToken?: string

  userLocale: string = 'en'
  userTimeZone: string = 'America/New_York'
}

export class NotionAPI {
  private readonly _apiBaseUrl: string
  private readonly _authToken?: string
  private readonly _userLocale: string
  private readonly _userTimeZone: string

  constructor(opts: NotionAPIOptions) {
    this._apiBaseUrl = opts.apiBaseUrl
    this._authToken = opts.authToken
    this._userLocale = opts.userLocale
    this._userTimeZone = opts.userTimeZone
  }

  public async getPage(pageId: string) {
    const page = await this.getPageChunk(pageId)
    const baseBlocks = page.recordMap.block

    let allBlocks: notion.ACLBlockMap = {
      ...baseBlocks
    }
    let allBlockKeys

    while (true) {
      allBlockKeys = Object.keys(allBlocks)

      const pendingBlocks = allBlockKeys.flatMap((blockId) => {
        const block = allBlocks[blockId]
        const content = block.value && block.value.content

        return content && block.value.type !== 'page'
          ? content.filter((id: string) => !allBlocks[id])
          : []
      })

      if (!pendingBlocks.length) {
        break
      }

      const newBlocks = await fetchBlocks(pendingBlocks).then(
        (res) => res.recordMap.block
      )

      allBlocks = { ...allBlocks, ...newBlocks }
    }
  }

  public async getPageChunk(pageId: string) {
    return this.fetch<types.PageChunk>({
      endpoint: 'loadPageChunk',
      body: {
        pageId,
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
    return this.fetch<types.RecordValues<notion.ACLUser>>({
      endpoint: 'getRecordValues',
      body: {
        requests: userIds.map((id) => ({ id, table: 'notion_user' }))
      }
    })
  }

  public async getBlocks(blockIds: string[]) {
    return this.fetch<types.RecordValues<notion.ACLBlock>>({
      endpoint: 'getRecordValues',
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
