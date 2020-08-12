import ky from 'ky'

import * as notion from 'notion-types'
import * as types from './types'

export * from './types'

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

  private async _fetch<T>(endpoint: string, body: object): Promise<T> {
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

  public async getPage(pageId: string) {
    return this._fetch<types.PageChunk>('loadPageChunk', {
      pageId,
      limit: 999,
      cursor: { stack: [] },
      chunkNumber: 0,
      verticalColumns: false
    })
  }

  public async getCollectionData(
    collectionId: string,
    collectionViewId: string,
    collectionType: string = 'table'
  ) {
    return this._fetch<types.CollectionData>('queryCollection', {
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
    })
  }

  public async getUsers(userIds: string[]) {
    return this._fetch<types.RecordValues<notion.ACLUser>>('getRecordValues', {
      requests: userIds.map((id) => ({ id, table: 'notion_user' }))
    })
  }

  public async getBlocks(blockIds: string[]) {
    return this._fetch<types.RecordValues<notion.ACLBlock>>('getRecordValues', {
      recordVersionMap: {
        block: blockIds.reduce(
          (acc, blockId) => ({
            ...acc,
            [blockId]: -1
          }),
          {}
        )
      }
    })
  }

  public async search(params: types.NotionSearchParams) {
    return this._fetch<types.NotionSearchResults>('search', {
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
    })
  }
}
