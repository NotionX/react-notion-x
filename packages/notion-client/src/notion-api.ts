import got, { OptionsOfJSONResponseBody } from 'got'
import pMap from 'p-map'

import { parsePageId, getPageContentBlockIds, uuidToId } from 'notion-utils'
import * as notion from 'notion-types'

import * as types from './types'

/**
 * Main Notion API client.
 */
export class NotionAPI {
  private readonly _apiBaseUrl: string
  private readonly _authToken?: string
  private readonly _activeUser?: string
  private readonly _userLocale: string
  private readonly _userTimeZone: string

  constructor({
    apiBaseUrl = 'https://www.notion.so/api/v3',
    authToken,
    activeUser,
    userLocale = 'en',
    userTimeZone = 'America/New_York'
  }: {
    apiBaseUrl?: string
    authToken?: string
    userLocale?: string
    userTimeZone?: string
    activeUser?: string
  } = {}) {
    this._apiBaseUrl = apiBaseUrl
    this._authToken = authToken
    this._activeUser = activeUser
    this._userLocale = userLocale
    this._userTimeZone = userTimeZone
  }

  public async getPage(
    pageId: string,
    {
      concurrency = 3,
      fetchCollections = true,
      signFileUrls = true,
      gotOptions
    }: {
      concurrency?: number
      fetchCollections?: boolean
      signFileUrls?: boolean
      gotOptions?: OptionsOfJSONResponseBody
    } = {}
  ): Promise<notion.ExtendedRecordMap> {
    const page = await this.getPageRaw(pageId, gotOptions)
    const recordMap = page?.recordMap as notion.ExtendedRecordMap

    if (!recordMap?.block) {
      throw new Error(`Notion page not found "${uuidToId(pageId)}"`)
    }

    // ensure that all top-level maps exist
    recordMap.collection = recordMap.collection ?? {}
    recordMap.collection_view = recordMap.collection_view ?? {}
    recordMap.notion_user = recordMap.notion_user ?? {}

    // additional mappings added for convenience
    // note: these are not native notion objects
    recordMap.collection_query = {}
    recordMap.signed_urls = {}

    // fetch any missing content blocks
    while (true) {
      const pendingBlockIds = getPageContentBlockIds(recordMap).filter(
        (id) => !recordMap.block[id]
      )

      if (!pendingBlockIds.length) {
        break
      }

      const newBlocks = await this.getBlocks(pendingBlockIds, gotOptions).then(
        (res) => res.recordMap.block
      )

      recordMap.block = { ...recordMap.block, ...newBlocks }
    }

    const contentBlockIds = getPageContentBlockIds(recordMap)

    // Optionally fetch all data for embedded collections and their associated views.
    // NOTE: We're eagerly fetching *all* data for each collection and all of its views.
    // This is really convenient in order to ensure that all data needed for a given
    // Notion page is readily available for use cases involving server-side rendering
    // and edge caching.
    if (fetchCollections) {
      const allCollectionInstances = contentBlockIds.flatMap((blockId) => {
        const block = recordMap.block[blockId].value

        if (
          block &&
          (block.type === 'collection_view' ||
            block.type === 'collection_view_page')
        ) {
          return block.view_ids.map((collectionViewId) => ({
            collectionId: block.collection_id,
            collectionViewId
          }))
        } else {
          return []
        }
      })

      // fetch data for all collection view instances
      await pMap(
        allCollectionInstances,
        async (collectionInstance) => {
          const { collectionId, collectionViewId } = collectionInstance
          const collectionView =
            recordMap.collection_view[collectionViewId]?.value

          try {
            const collectionData = await this.getCollectionData(
              collectionId,
              collectionViewId,
              {
                type: collectionView?.type,
                query: this.getQuery(collectionView),
                groups:
                  collectionView?.format?.board_groups2 ||
                  collectionView?.format?.board_groups ||
                  collectionView?.format?.board_columns,
                gotOptions
              }
            )

            // await fs.writeFile(
            //   `${collectionId}-${collectionViewId}.json`,
            //   JSON.stringify(collectionData.result, null, 2)
            // )

            recordMap.block = {
              ...recordMap.block,
              ...collectionData.recordMap.block
            }

            recordMap.collection = {
              ...recordMap.collection,
              ...collectionData.recordMap.collection
            }

            recordMap.collection_view = {
              ...recordMap.collection_view,
              ...collectionData.recordMap.collection_view
            }

            recordMap.notion_user = {
              ...recordMap.notion_user,
              ...collectionData.recordMap.notion_user
            }

            recordMap.collection_query![collectionId] = {
              ...recordMap.collection_query![collectionId],
              [collectionViewId]: collectionData.result
            }
          } catch (err) {
            // It's possible for public pages to link to private collections, in which case
            // Notion returns a 400 error
            console.warn('NotionAPI collectionQuery error', err.message)
          }
        },
        {
          concurrency
        }
      )
    }

    // Optionally fetch signed URLs for any embedded files.
    // NOTE: Similar to collection data, we default to eagerly fetching signed URL info
    // because it is preferable for many use cases as opposed to making these API calls
    // lazily from the client-side.
    if (signFileUrls) {
      const allFileInstances = contentBlockIds.flatMap((blockId) => {
        const block = recordMap.block[blockId].value

        if (
          block &&
          (block.type === 'pdf' ||
            block.type === 'audio' ||
            block.type === 'video' ||
            block.type === 'file')
        ) {
          const source = block.properties?.source?.[0]?.[0]
          // console.log(block, source)

          if (source) {
            if (
              source.indexOf('youtube') >= 0 ||
              source.indexOf('vimeo') >= 0
            ) {
              return []
            }

            return {
              permissionRecord: {
                table: 'block',
                id: block.id
              },
              url: source
            }
          }
        }

        return []
      })

      if (allFileInstances.length > 0) {
        try {
          const { signedUrls } = await this.getSignedFileUrls(
            allFileInstances,
            gotOptions
          )

          if (signedUrls.length === allFileInstances.length) {
            for (let i = 0; i < allFileInstances.length; ++i) {
              const file = allFileInstances[i]
              const signedUrl = signedUrls[i]

              recordMap.signed_urls[file.permissionRecord.id] = signedUrl
            }
          }
        } catch (err) {
          console.warn('NotionAPI getSignedfileUrls error', err)
        }
      }
    }

    return recordMap
  }

  public async getPageRaw(
    pageId: string,
    gotOptions?: OptionsOfJSONResponseBody
  ) {
    const parsedPageId = parsePageId(pageId)

    if (!parsedPageId) {
      throw new Error(`invalid notion pageId "${pageId}"`)
    }

    const body = {
      pageId: parsedPageId,
      limit: 100,
      cursor: { stack: [] },
      chunkNumber: 0,
      verticalColumns: false
    }

    return this.fetch<notion.PageChunk>({
      endpoint: 'loadPageChunk',
      body,
      gotOptions
    })
  }

  public async getCollectionData(
    collectionId: string,
    collectionViewId: string,
    {
      type = 'table',
      query = { aggregations: [{ property: 'title', aggregator: 'count' }] },
      groups = undefined,
      limit = 999999,
      searchQuery = '',
      userTimeZone = this._userTimeZone,
      userLocale = this._userLocale,
      loadContentCover = true,
      gotOptions
    }: {
      type?: notion.CollectionViewType
      query?: any
      groups?: any
      limit?: number
      searchQuery?: string
      userTimeZone?: string
      userLocale?: string
      loadContentCover?: boolean
      gotOptions?: OptionsOfJSONResponseBody
    } = {}
  ) {
    // TODO: All other collection types queries fail with 400 errors.
    // My guess is that they require slightly different query params, but since
    // their results are the same AFAICT, there's not much point in supporting
    // them.
    if (type !== 'table' && type !== 'board') {
      type = 'table'
    }

    const loader: any = {
      type,
      limit,
      searchQuery,
      userTimeZone,
      userLocale,
      loadContentCover
    }

    if (groups) {
      // used for 'board' collection view queries
      loader.groups = groups
    }

    // useful for debugging collection queries
    // console.log(JSON.stringify('queryCollection', { collectionId, collectionViewId, query, loader }, null, 2))

    return this.fetch<notion.CollectionInstance>({
      endpoint: 'queryCollection',
      body: {
        collectionId,
        collectionViewId,
        query,
        loader
      },
      gotOptions
    })
  }

  //handle setting group_by for the query if it isn't already
  private getQuery(collectionView: notion.CollectionView | undefined) {
    let query = collectionView?.query2 || collectionView?.query
    const groupBy = collectionView?.format?.board_columns_by
      ? collectionView?.format?.board_columns_by?.property
      : undefined
    if (groupBy) {
      query.group_by = groupBy
    }
    return query
  }

  public async getUsers(
    userIds: string[],
    gotOptions?: OptionsOfJSONResponseBody
  ) {
    return this.fetch<notion.RecordValues<notion.User>>({
      endpoint: 'getRecordValues',
      body: {
        requests: userIds.map((id) => ({ id, table: 'notion_user' }))
      },
      gotOptions
    })
  }

  public async getBlocks(
    blockIds: string[],
    gotOptions?: OptionsOfJSONResponseBody
  ) {
    return this.fetch<notion.PageChunk>({
      endpoint: 'syncRecordValues',
      body: {
        requests: blockIds.map((blockId) => ({
          // TODO: when to use table 'space' vs 'block'?
          table: 'block',
          id: blockId,
          version: -1
        }))
      },
      gotOptions
    })
  }

  public async getSignedFileUrls(
    urls: types.SignedUrlRequest[],
    gotOptions?: OptionsOfJSONResponseBody
  ) {
    return this.fetch<types.SignedUrlResponse>({
      endpoint: 'getSignedFileUrls',
      body: {
        urls
      },
      gotOptions
    })
  }

  public async search(
    params: notion.SearchParams,
    gotOptions?: OptionsOfJSONResponseBody
  ) {
    return this.fetch<notion.SearchResults>({
      endpoint: 'search',
      body: {
        type: 'BlocksInAncestor',
        source: 'quick_find_public',
        ancestorId: parsePageId(params.ancestorId),
        sort: 'Relevance',
        limit: params.limit || 20,
        query: params.query,
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
        }
      },
      gotOptions
    })
  }

  public async fetch<T>({
    endpoint,
    body,
    gotOptions,
    headers: clientHeaders
  }: {
    endpoint: string
    body: object
    gotOptions?: OptionsOfJSONResponseBody
    headers?: any
  }): Promise<T> {
    const headers: any = {
      ...clientHeaders,
      ...gotOptions?.headers,
      'Content-Type': 'application/json'
    }

    if (this._authToken) {
      headers.cookie = `token_v2=${this._authToken}`
    }

    if (this._activeUser) {
      headers['x-notion-active-user-header'] = this._activeUser
    }

    const url = `${this._apiBaseUrl}/${endpoint}`

    return got
      .post(url, {
        ...gotOptions,
        json: body,
        headers
      })
      .json()

    // return fetch(url, {
    //   method: 'post',
    //   body: JSON.stringify(body),
    //   headers
    // }).then((res) => {
    //   console.log(endpoint, res)
    //   return res.json()
    // })
  }
}
