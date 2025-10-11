// import { promises as fs } from 'fs'
//import ky, { type Options as OfetchOptions } from 'ky'

import type * as notion from 'notion-types'
import {
  getBlockCollectionId,
  getPageContentBlockIds,
  parsePageId,
  uuidToId
} from 'notion-utils'
import { type FetchOptions as OfetchOptions, ofetch } from 'ofetch'
import pMap from 'p-map'

import type * as types from './types'

/**
 * Main Notion API client.
 */
export class NotionAPI {
  private readonly _apiBaseUrl: string
  private readonly _authToken?: string
  private readonly _activeUser?: string
  private readonly _userTimeZone: string
  private readonly _ofetchOptions?: OfetchOptions

  constructor({
    apiBaseUrl = 'https://www.notion.so/api/v3',
    authToken,
    activeUser,
    userTimeZone = 'America/New_York',
    ofetchOptions
  }: {
    apiBaseUrl?: string
    authToken?: string
    userLocale?: string
    userTimeZone?: string
    activeUser?: string
    ofetchOptions?: OfetchOptions
  } = {}) {
    this._apiBaseUrl = apiBaseUrl
    this._authToken = authToken
    this._activeUser = activeUser
    this._userTimeZone = userTimeZone
    this._ofetchOptions = ofetchOptions
  }

  public async getPage(
    pageId: string,
    {
      concurrency = 3,
      fetchMissingBlocks = true,
      fetchCollections = true,
      signFileUrls = true,
      chunkLimit = 100,
      chunkNumber = 0,
      throwOnCollectionErrors = false,
      collectionReducerLimit = 999,
      fetchRelationPages = false,
      ofetchOptions
    }: {
      concurrency?: number
      fetchMissingBlocks?: boolean
      fetchCollections?: boolean
      signFileUrls?: boolean
      chunkLimit?: number
      chunkNumber?: number
      throwOnCollectionErrors?: boolean
      collectionReducerLimit?: number
      fetchRelationPages?: boolean
      ofetchOptions?: OfetchOptions
    } = {}
  ): Promise<notion.ExtendedRecordMap> {
    const page = await this.getPageRaw(pageId, {
      chunkLimit,
      chunkNumber,
      ofetchOptions
    })
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

    if (fetchMissingBlocks) {
      while (true) {
        // fetch any missing content blocks
        const pendingBlockIds = getPageContentBlockIds(recordMap).filter(
          (id) => !recordMap.block[id]
        )

        if (!pendingBlockIds.length) {
          break
        }

        const newBlocks = await this.getBlocks(
          pendingBlockIds,
          ofetchOptions
        ).then((res) => res.recordMap.block)

        recordMap.block = { ...recordMap.block, ...newBlocks }
      }
    }

    const contentBlockIds = getPageContentBlockIds(recordMap)

    // Optionally fetch all data for embedded collections and their associated views.
    // NOTE: We're eagerly fetching *all* data for each collection and all of its views.
    // This is really convenient in order to ensure that all data needed for a given
    // Notion page is readily available for use cases involving server-side rendering
    // and edge caching.
    if (fetchCollections) {
      const allCollectionInstances: Array<{
        collectionId: string
        collectionViewId: string
        spaceId?: string
      }> = contentBlockIds.flatMap((blockId) => {
        const block = recordMap.block[blockId]?.value
        const collectionId =
          block &&
          (block.type === 'collection_view' ||
            block.type === 'collection_view_page') &&
          getBlockCollectionId(block, recordMap)

        if (collectionId) {
          const spaceId = block?.space_id
          return block.view_ids?.map((collectionViewId) => ({
            collectionId,
            collectionViewId,
            spaceId
          }))
        } else {
          return []
        }
      })

      // fetch data for all collection view instances
      await pMap(
        allCollectionInstances,
        async (collectionInstance) => {
          const { collectionId, collectionViewId, spaceId } = collectionInstance
          const collectionView =
            recordMap.collection_view[collectionViewId]?.value

          try {
            const collectionData = await this.getCollectionData(
              collectionId,
              collectionViewId,
              collectionView,
              {
                limit: collectionReducerLimit,
                spaceId,
                ofetchOptions
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
              [collectionViewId]: (collectionData.result as any)?.reducerResults
            }
          } catch (err: any) {
            // It's possible for public pages to link to private collections,
            // in which case Notion returns a 400 error. This may be that or it
            // may be something else.
            console.warn(
              'NotionAPI collectionQuery error',
              { pageId, collectionId, collectionViewId },
              err.message
            )

            if (throwOnCollectionErrors) {
              throw err
              // throw new Error(
              //   `NotionAPI error fetching collectionQuery for page "${pageId}" collection "${collectionId}" view "${collectionViewId}": ${err.message}`,
              //   {
              //     cause: err
              //   }
              // )
            } else {
              console.error(err)
            }
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
      await this.addSignedUrls({ recordMap, contentBlockIds, ofetchOptions })
    }

    if (fetchRelationPages) {
      const newBlocks = await this.fetchRelationPages(recordMap, ofetchOptions)
      recordMap.block = { ...recordMap.block, ...newBlocks }
    }

    return recordMap
  }

  fetchRelationPages = async (
    recordMap: notion.ExtendedRecordMap,
    ofetchOptions: OfetchOptions | undefined
  ): Promise<notion.BlockMap> => {
    const maxIterations = 10

    for (let i = 0; i < maxIterations; ++i) {
      const relationPageIdsThisIteration = new Set<string>()

      for (const blockId of Object.keys(recordMap.block)) {
        const blockValue = recordMap.block[blockId]?.value
        if (
          blockValue?.parent_table === 'collection' &&
          blockValue?.parent_id
        ) {
          const collection = recordMap.collection[blockValue.parent_id]?.value
          if (collection?.schema) {
            const ids = this.extractRelationPageIdsFromBlock(
              blockValue,
              collection.schema
            )
            for (const id of ids) relationPageIdsThisIteration.add(id)
          }
        }
      }

      const missingRelationPageIds = Array.from(
        relationPageIdsThisIteration
      ).filter((id) => !recordMap.block[id]?.value)

      if (!missingRelationPageIds.length) break

      try {
        const newBlocks = await this.getBlocks(
          missingRelationPageIds,
          ofetchOptions
        ).then((res) => res.recordMap.block)
        recordMap.block = { ...recordMap.block, ...newBlocks }
      } catch (err: any) {
        console.warn(
          'NotionAPI getBlocks error during fetchRelationPages:',
          err
        )
        // consider break or delay/retry here
      }
    }

    return recordMap.block
  }

  extractRelationPageIdsFromBlock = (
    blockValue: any,
    collectionSchema: any
  ): Set<string> => {
    const pageIds = new Set<string>()

    for (const propertyId of Object.keys(blockValue.properties || {})) {
      const schema = collectionSchema[propertyId]
      if (schema?.type === 'relation') {
        const decorations = blockValue.properties[propertyId]
        if (Array.isArray(decorations)) {
          for (const decoration of decorations) {
            if (
              Array.isArray(decoration) &&
              decoration.length > 1 &&
              decoration[0] === '‣'
            ) {
              const pagePointer = decoration[1]?.[0]
              if (
                Array.isArray(pagePointer) &&
                pagePointer.length > 1 &&
                pagePointer[0] === 'p'
              ) {
                pageIds.add(pagePointer[1])
              }
            }
          }
        }
      }
    }
    return pageIds
  }

  public async addSignedUrls({
    recordMap,
    contentBlockIds,
    ofetchOptions = {}
  }: {
    recordMap: notion.ExtendedRecordMap
    contentBlockIds?: string[]
    ofetchOptions?: OfetchOptions
  }) {
    recordMap.signed_urls = {}

    if (!contentBlockIds) {
      contentBlockIds = getPageContentBlockIds(recordMap)
    }

    const allFileInstances = contentBlockIds.flatMap((blockId) => {
      const block = recordMap.block[blockId]?.value

      if (
        block &&
        (block.type === 'pdf' ||
          block.type === 'audio' ||
          (block.type === 'image' && block.file_ids?.length) ||
          block.type === 'video' ||
          block.type === 'file' ||
          block.type === 'page')
      ) {
        const source =
          block.type === 'page'
            ? block.format?.page_cover
            : block.properties?.source?.[0]?.[0]
        // console.log(block, source)

        if (source) {
          if (
            source.includes('secure.notion-static.com') ||
            source.includes('prod-files-secure') ||
            source.includes('attachment:')
          ) {
            return {
              permissionRecord: {
                table: 'block',
                id: block.id
              },
              url: source
            }
          }

          return []
        }
      }

      return []
    })

    if (allFileInstances.length > 0) {
      try {
        const { signedUrls } = await this.getSignedFileUrls(
          allFileInstances,
          ofetchOptions
        )

        if (signedUrls.length === allFileInstances.length) {
          for (const [i, file] of allFileInstances.entries()) {
            const signedUrl = signedUrls[i]
            if (!signedUrl) continue

            const blockId = file.permissionRecord.id
            if (!blockId) continue

            recordMap.signed_urls[blockId] = signedUrl
          }
        }
      } catch (err) {
        console.warn('NotionAPI getSignedfileUrls error', err)
      }
    }
  }

  public async getPageRaw(
    pageId: string,
    {
      ofetchOptions,
      chunkLimit = 100,
      chunkNumber = 0
    }: {
      chunkLimit?: number
      chunkNumber?: number
      ofetchOptions?: OfetchOptions
    } = {}
  ) {
    const parsedPageId = parsePageId(pageId)

    if (!parsedPageId) {
      throw new Error(`invalid notion pageId "${pageId}"`)
    }

    const body = {
      pageId: parsedPageId,
      limit: chunkLimit,
      chunkNumber,
      cursor: { stack: [] },
      verticalColumns: false
    }

    return this.fetch<notion.PageChunk>({
      endpoint: 'loadPageChunk',
      body,
      ofetchOptions
    })
  }

  public async getCollectionData(
    collectionId: string,
    collectionViewId: string,
    collectionView?: any,
    {
      limit = 999,
      searchQuery = '',
      userTimeZone = this._userTimeZone,
      loadContentCover = true,
      spaceId,
      ofetchOptions
    }: {
      type?: notion.CollectionViewType
      limit?: number
      searchQuery?: string
      userTimeZone?: string
      userLocale?: string
      loadContentCover?: boolean
      spaceId?: string
      ofetchOptions?: OfetchOptions
    } = {}
  ) {
    const type = collectionView?.type
    const isBoardType = type === 'board'
    const groupBy = isBoardType
      ? collectionView?.format?.board_columns_by
      : collectionView?.format?.collection_group_by

    let filters = []
    if (collectionView?.format?.property_filters) {
      filters = collectionView.format?.property_filters.map(
        (filterObj: any) => {
          //get the inner filter
          return {
            filter: filterObj?.filter?.filter,
            property: filterObj?.filter?.property
          }
        }
      )
    }

    // Fixes formula filters from not working
    if (collectionView?.query2?.filter?.filters) {
      filters.push(...collectionView.query2.filter.filters)
    }

    let loader: any = {
      type: 'reducer',
      reducers: {
        collection_group_results: {
          type: 'results',
          limit,
          loadContentCover
        }
      },
      sort: [],
      ...collectionView?.query2,
      filter: {
        filters,
        operator: 'and'
      },
      searchQuery,
      userTimeZone
    }

    if (groupBy) {
      const groups =
        collectionView?.format?.board_columns ||
        collectionView?.format?.collection_groups ||
        []
      const iterators = [isBoardType ? 'board' : 'group_aggregation', 'results']
      const operators = {
        checkbox: 'checkbox_is',
        url: 'string_starts_with',
        text: 'string_starts_with',
        select: 'enum_is',
        multi_select: 'enum_contains',
        created_time: 'date_is_within',
        undefined: 'is_empty'
      }

      const reducersQuery: Record<string, any> = {}
      for (const group of groups) {
        const {
          property,
          value: { value, type }
        } = group

        for (const iterator of iterators) {
          const iteratorProps =
            iterator === 'results'
              ? {
                  type: iterator,
                  limit
                }
              : {
                  type: 'aggregation',
                  aggregation: {
                    aggregator: 'count'
                  }
                }

          const isUncategorizedValue = value === undefined
          const isDateValue = value?.range
          // TODO: review dates reducers
          const queryLabel = isUncategorizedValue
            ? 'uncategorized'
            : isDateValue
              ? value.range?.start_date || value.range?.end_date
              : value?.value || value

          const queryValue =
            !isUncategorizedValue && (isDateValue || value?.value || value)

          reducersQuery[`${iterator}:${type}:${queryLabel}`] = {
            ...iteratorProps,
            filter: {
              operator: 'and',
              filters: [
                {
                  property,
                  filter: {
                    operator: !isUncategorizedValue
                      ? operators[type as keyof typeof operators]
                      : 'is_empty',
                    ...(!isUncategorizedValue && {
                      value: {
                        type: 'exact',
                        value: queryValue
                      }
                    })
                  }
                }
              ]
            }
          }
        }
      }

      const reducerLabel = isBoardType ? 'board_columns' : `${type}_groups`
      loader = {
        type: 'reducer',
        reducers: {
          [reducerLabel]: {
            type: 'groups',
            version: 'v2',
            groupBy,
            ...(collectionView?.query2?.filter && {
              filter: collectionView?.query2?.filter
            }),
            groupSortPreference: groups.map((group: any) => ({
              property: group?.property,
              value: {
                type: group?.value?.type,
                value: group?.value?.value
              }
            })),
            limit
          },
          ...reducersQuery
        },
        ...collectionView?.query2,
        searchQuery,
        userTimeZone,
        //TODO: add filters here
        filter: {
          filters,
          operator: 'and'
        }
      }
    }

    // if (isBoardType) {
    //   console.log(
    //     JSON.stringify(
    //       {
    //         collectionId,
    //         collectionViewId,
    //         loader,
    //         groupBy: groupBy || 'NONE',
    //         collectionViewQuery: collectionView.query2 || 'NONE'
    //       },
    //       null,
    //       2
    //     )
    //   )
    // }

    const headers: any = {}
    if (spaceId) {
      headers['x-notion-space-id'] = spaceId
    }

    return this.fetch<notion.CollectionInstance>({
      endpoint: 'queryCollection',
      body: {
        collection: {
          id: collectionId
        },
        collectionView: {
          id: collectionViewId
        },
        source: {
          type: 'collection',
          id: collectionId
        },
        loader
      },
      headers,
      ofetchOptions: {
        timeout: 60_000,
        ...ofetchOptions,
        params: {
          // TODO: spread ofetchOptions?.searchParams
          src: 'initial_load'
        }
      }
    })
  }

  public async getUsers(userIds: string[], ofetchOptions?: OfetchOptions) {
    return this.fetch<notion.RecordValues<notion.User>>({
      endpoint: 'getRecordValues',
      body: {
        requests: userIds.map((id) => ({ id, table: 'notion_user' }))
      },
      ofetchOptions
    })
  }

  public async getBlocks(blockIds: string[], ofetchOptions?: OfetchOptions) {
    return this.fetch<notion.PageChunk>({
      endpoint: 'syncRecordValuesMain',
      body: {
        requests: blockIds.map((blockId) => ({
          // TODO: when to use table 'space' vs 'block'?
          table: 'block',
          id: blockId,
          version: -1
        }))
      },
      ofetchOptions
    })
  }

  public async getSignedFileUrls(
    urls: types.SignedUrlRequest[],
    ofetchOptions?: OfetchOptions
  ) {
    return this.fetch<types.SignedUrlResponse>({
      endpoint: 'getSignedFileUrls',
      body: {
        urls
      },
      ofetchOptions
    })
  }

  public async search(
    params: notion.SearchParams,
    ofetchOptions?: OfetchOptions
  ) {
    const body = {
      type: 'BlocksInAncestor',
      source: 'quick_find_public',
      ancestorId: parsePageId(params.ancestorId),
      sort: {
        field: 'relevance'
      },
      limit: params.limit || 20,
      query: params.query,
      filters: {
        isDeletedOnly: false,
        isNavigableOnly: false,
        excludeTemplates: true,
        requireEditPermissions: false,
        includePublicPagesWithoutExplicitAccess: true,
        ancestors: [],
        createdBy: [],
        editedBy: [],
        lastEditedTime: {},
        createdTime: {},
        ...params.filters
      }
    }

    return this.fetch<notion.SearchResults>({
      endpoint: 'search',
      body,
      ofetchOptions
    })
  }

  public async fetch<T>({
    endpoint,
    body,
    ofetchOptions,
    headers: clientHeaders
  }: {
    endpoint: string
    body: object
    ofetchOptions?: OfetchOptions
    headers?: any
  }): Promise<T> {
    const headers: any = {
      ...clientHeaders,
      ...this._ofetchOptions?.headers,
      ...ofetchOptions?.headers,
      'Content-Type': 'application/json'
    }

    if (this._authToken) {
      headers['Authorization'] = `Bearer ${this._authToken}`
    }

    if (this._activeUser) {
      headers['x-notion-active-user-header'] = this._activeUser
    }

    const url = `${this._apiBaseUrl}/${endpoint}`

    /*     const res = await ky.post(url, {
      mode: 'no-cors',
      ...this._ofetchOptions,
      ...ofetchOptions,
      json: body,
      headers
    }) */

    // TODO: we're awaiting the first fetch and then separately awaiting
    // `res.json()` because there seems to be some weird error which repros
    // sporadically when loading collections where the body is already used.
    // No idea why, but from my testing, separating these into two separate
    // steps seems to fix the issue locally for me...
    // console.log(endpoint, { bodyUsed: res.bodyUsed })

    /* return res.json<T>() */
    const res = ofetch(url, {
      method: 'POST',
      mode: 'no-cors',
      ...this._ofetchOptions,
      ...ofetchOptions,
      body,
      headers
    })
    return res
  }
}
