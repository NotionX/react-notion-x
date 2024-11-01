import ky, {} from 'ky';
import { getBlockCollectionId, getPageContentBlockIds, parsePageId, uuidToId } from 'notion-utils';
import pMap from 'p-map';
/**
 * Main Notion API client.
 */
export class NotionAPI {
    _apiBaseUrl;
    _authToken;
    _activeUser;
    _userTimeZone;
    _kyOptions;
    constructor({ apiBaseUrl = 'https://www.notion.so/api/v3', authToken, activeUser, userTimeZone = 'America/New_York', kyOptions } = {}) {
        this._apiBaseUrl = apiBaseUrl;
        this._authToken = authToken;
        this._activeUser = activeUser;
        this._userTimeZone = userTimeZone;
        this._kyOptions = kyOptions;
    }
    async getPage(pageId, { concurrency = 3, fetchMissingBlocks = true, fetchCollections = true, signFileUrls = true, chunkLimit = 100, chunkNumber = 0, kyOptions } = {}) {
        const page = await this.getPageRaw(pageId, {
            chunkLimit,
            chunkNumber,
            kyOptions
        });
        const recordMap = page?.recordMap;
        if (!recordMap?.block) {
            throw new Error(`Notion page not found "${uuidToId(pageId)}"`);
        }
        // ensure that all top-level maps exist
        recordMap.collection = recordMap.collection ?? {};
        recordMap.collection_view = recordMap.collection_view ?? {};
        recordMap.notion_user = recordMap.notion_user ?? {};
        // additional mappings added for convenience
        // note: these are not native notion objects
        recordMap.collection_query = {};
        recordMap.signed_urls = {};
        if (fetchMissingBlocks) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                // fetch any missing content blocks
                const pendingBlockIds = getPageContentBlockIds(recordMap).filter((id) => !recordMap.block[id]);
                if (!pendingBlockIds.length) {
                    break;
                }
                const newBlocks = await this.getBlocks(pendingBlockIds, kyOptions).then((res) => res.recordMap.block);
                recordMap.block = { ...recordMap.block, ...newBlocks };
            }
        }
        const contentBlockIds = getPageContentBlockIds(recordMap);
        // Optionally fetch all data for embedded collections and their associated views.
        // NOTE: We're eagerly fetching *all* data for each collection and all of its views.
        // This is really convenient in order to ensure that all data needed for a given
        // Notion page is readily available for use cases involving server-side rendering
        // and edge caching.
        if (fetchCollections) {
            const allCollectionInstances = contentBlockIds.flatMap((blockId) => {
                const block = recordMap.block[blockId]?.value;
                const collectionId = block &&
                    (block.type === 'collection_view' ||
                        block.type === 'collection_view_page') &&
                    getBlockCollectionId(block, recordMap);
                if (collectionId) {
                    return block.view_ids?.map((collectionViewId) => ({
                        collectionId,
                        collectionViewId
                    }));
                }
                else {
                    return [];
                }
            });
            // fetch data for all collection view instances
            await pMap(allCollectionInstances, async (collectionInstance) => {
                const { collectionId, collectionViewId } = collectionInstance;
                const collectionView = recordMap.collection_view[collectionViewId]?.value;
                try {
                    const collectionData = await this.getCollectionData(collectionId, collectionViewId, collectionView, {
                        kyOptions
                    });
                    // await fs.writeFile(
                    //   `${collectionId}-${collectionViewId}.json`,
                    //   JSON.stringify(collectionData.result, null, 2)
                    // )
                    recordMap.block = {
                        ...recordMap.block,
                        ...collectionData.recordMap.block
                    };
                    recordMap.collection = {
                        ...recordMap.collection,
                        ...collectionData.recordMap.collection
                    };
                    recordMap.collection_view = {
                        ...recordMap.collection_view,
                        ...collectionData.recordMap.collection_view
                    };
                    recordMap.notion_user = {
                        ...recordMap.notion_user,
                        ...collectionData.recordMap.notion_user
                    };
                    recordMap.collection_query[collectionId] = {
                        ...recordMap.collection_query[collectionId],
                        [collectionViewId]: collectionData.result?.reducerResults
                    };
                }
                catch (err) {
                    // It's possible for public pages to link to private collections, in which case
                    // Notion returns a 400 error
                    console.warn('NotionAPI collectionQuery error', pageId, err.message);
                    console.error(err);
                }
            }, {
                concurrency
            });
        }
        // Optionally fetch signed URLs for any embedded files.
        // NOTE: Similar to collection data, we default to eagerly fetching signed URL info
        // because it is preferable for many use cases as opposed to making these API calls
        // lazily from the client-side.
        if (signFileUrls) {
            await this.addSignedUrls({ recordMap, contentBlockIds, kyOptions });
        }
        return recordMap;
    }
    async addSignedUrls({ recordMap, contentBlockIds, kyOptions = {} }) {
        recordMap.signed_urls = {};
        if (!contentBlockIds) {
            contentBlockIds = getPageContentBlockIds(recordMap);
        }
        const allFileInstances = contentBlockIds.flatMap((blockId) => {
            const block = recordMap.block[blockId]?.value;
            if (block &&
                (block.type === 'pdf' ||
                    block.type === 'audio' ||
                    (block.type === 'image' && block.file_ids?.length) ||
                    block.type === 'video' ||
                    block.type === 'file' ||
                    block.type === 'page')) {
                const source = block.type === 'page'
                    ? block.format?.page_cover
                    : block.properties?.source?.[0]?.[0];
                // console.log(block, source)
                if (source) {
                    if (!source.includes('secure.notion-static.com')) {
                        return [];
                    }
                    return {
                        permissionRecord: {
                            table: 'block',
                            id: block.id
                        },
                        url: source
                    };
                }
            }
            return [];
        });
        if (allFileInstances.length > 0) {
            try {
                const { signedUrls } = await this.getSignedFileUrls(allFileInstances, kyOptions);
                if (signedUrls.length === allFileInstances.length) {
                    for (const [i, file] of allFileInstances.entries()) {
                        const signedUrl = signedUrls[i];
                        if (!signedUrl)
                            continue;
                        const blockId = file.permissionRecord.id;
                        if (!blockId)
                            continue;
                        recordMap.signed_urls[blockId] = signedUrl;
                    }
                }
            }
            catch (err) {
                console.warn('NotionAPI getSignedfileUrls error', err);
            }
        }
    }
    async getPageRaw(pageId, { kyOptions, chunkLimit = 100, chunkNumber = 0 } = {}) {
        const parsedPageId = parsePageId(pageId);
        if (!parsedPageId) {
            throw new Error(`invalid notion pageId "${pageId}"`);
        }
        const body = {
            pageId: parsedPageId,
            limit: chunkLimit,
            chunkNumber,
            cursor: { stack: [] },
            verticalColumns: false
        };
        return this.fetch({
            endpoint: 'loadPageChunk',
            body,
            kyOptions
        });
    }
    async getCollectionData(collectionId, collectionViewId, collectionView, { limit = 9999, searchQuery = '', userTimeZone = this._userTimeZone, loadContentCover = true, kyOptions } = {}) {
        const type = collectionView?.type;
        const isBoardType = type === 'board';
        const groupBy = isBoardType
            ? collectionView?.format?.board_columns_by
            : collectionView?.format?.collection_group_by;
        let filters = [];
        if (collectionView?.format?.property_filters) {
            filters = collectionView.format?.property_filters.map((filterObj) => {
                //get the inner filter
                return {
                    filter: filterObj?.filter?.filter,
                    property: filterObj?.filter?.property
                };
            });
        }
        //Fixes formula filters from not working
        if (collectionView?.query2?.filter?.filters) {
            filters.push(...collectionView.query2.filter.filters);
        }
        let loader = {
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
        };
        if (groupBy) {
            const groups = collectionView?.format?.board_columns ||
                collectionView?.format?.collection_groups ||
                [];
            const iterators = [isBoardType ? 'board' : 'group_aggregation', 'results'];
            const operators = {
                checkbox: 'checkbox_is',
                url: 'string_starts_with',
                text: 'string_starts_with',
                select: 'enum_is',
                multi_select: 'enum_contains',
                created_time: 'date_is_within',
                undefined: 'is_empty'
            };
            const reducersQuery = {};
            for (const group of groups) {
                const { property, value: { value, type } } = group;
                for (const iterator of iterators) {
                    const iteratorProps = iterator === 'results'
                        ? {
                            type: iterator,
                            limit
                        }
                        : {
                            type: 'aggregation',
                            aggregation: {
                                aggregator: 'count'
                            }
                        };
                    const isUncategorizedValue = value === undefined;
                    const isDateValue = value?.range;
                    // TODO: review dates reducers
                    const queryLabel = isUncategorizedValue
                        ? 'uncategorized'
                        : isDateValue
                            ? value.range?.start_date || value.range?.end_date
                            : value?.value || value;
                    const queryValue = !isUncategorizedValue && (isDateValue || value?.value || value);
                    reducersQuery[`${iterator}:${type}:${queryLabel}`] = {
                        ...iteratorProps,
                        filter: {
                            operator: 'and',
                            filters: [
                                {
                                    property,
                                    filter: {
                                        operator: !isUncategorizedValue
                                            ? operators[type]
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
                    };
                }
            }
            const reducerLabel = isBoardType ? 'board_columns' : `${type}_groups`;
            loader = {
                type: 'reducer',
                reducers: {
                    [reducerLabel]: {
                        type: 'groups',
                        groupBy,
                        ...(collectionView?.query2?.filter && {
                            filter: collectionView?.query2?.filter
                        }),
                        groupSortPreference: groups.map((group) => group?.value),
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
            };
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
        return this.fetch({
            endpoint: 'queryCollection',
            body: {
                collection: {
                    id: collectionId
                },
                collectionView: {
                    id: collectionViewId
                },
                loader
            },
            kyOptions
        });
    }
    async getUsers(userIds, kyOptions) {
        return this.fetch({
            endpoint: 'getRecordValues',
            body: {
                requests: userIds.map((id) => ({ id, table: 'notion_user' }))
            },
            kyOptions
        });
    }
    async getBlocks(blockIds, kyOptions) {
        return this.fetch({
            endpoint: 'syncRecordValues',
            body: {
                requests: blockIds.map((blockId) => ({
                    // TODO: when to use table 'space' vs 'block'?
                    table: 'block',
                    id: blockId,
                    version: -1
                }))
            },
            kyOptions
        });
    }
    async getSignedFileUrls(urls, kyOptions) {
        return this.fetch({
            endpoint: 'getSignedFileUrls',
            body: {
                urls
            },
            kyOptions
        });
    }
    async search(params, kyOptions) {
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
                ancestors: [],
                createdBy: [],
                editedBy: [],
                lastEditedTime: {},
                createdTime: {},
                ...params.filters
            }
        };
        return this.fetch({
            endpoint: 'search',
            body,
            kyOptions
        });
    }
    async fetch({ endpoint, body, kyOptions, headers: clientHeaders }) {
        const headers = {
            ...clientHeaders,
            ...this._kyOptions?.headers,
            ...kyOptions?.headers,
            'Content-Type': 'application/json'
        };
        if (this._authToken) {
            headers.cookie = `token_v2=${this._authToken}`;
        }
        if (this._activeUser) {
            headers['x-notion-active-user-header'] = this._activeUser;
        }
        const url = `${this._apiBaseUrl}/${endpoint}`;
        return ky
            .post(url, {
            ...this._kyOptions,
            ...kyOptions,
            json: body,
            headers
        })
            .json();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aW9uLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvdGZpc2NoZXIvZGV2L21vZHVsZXMvcmVhY3Qtbm90aW9uLXgvcGFja2FnZXMvbm90aW9uLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJub3Rpb24tYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxFQUFFLEVBQTZCLE1BQU0sSUFBSSxDQUFBO0FBQ2xELE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIsc0JBQXNCLEVBQ3RCLFdBQVcsRUFDWCxRQUFRLEVBQ1QsTUFBTSxjQUFjLENBQUE7QUFDckIsT0FBTyxJQUFJLE1BQU0sT0FBTyxDQUFBO0FBSXhCOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFNBQVM7SUFDSCxXQUFXLENBQVE7SUFDbkIsVUFBVSxDQUFTO0lBQ25CLFdBQVcsQ0FBUztJQUNwQixhQUFhLENBQVE7SUFDckIsVUFBVSxDQUFZO0lBRXZDLFlBQVksRUFDVixVQUFVLEdBQUcsOEJBQThCLEVBQzNDLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxHQUFHLGtCQUFrQixFQUNqQyxTQUFTLEtBUVAsRUFBRTtRQUNKLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFBO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBO1FBQzNCLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFBO1FBQzdCLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFBO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFBO0lBQzdCLENBQUM7SUFFTSxLQUFLLENBQUMsT0FBTyxDQUNsQixNQUFjLEVBQ2QsRUFDRSxXQUFXLEdBQUcsQ0FBQyxFQUNmLGtCQUFrQixHQUFHLElBQUksRUFDekIsZ0JBQWdCLEdBQUcsSUFBSSxFQUN2QixZQUFZLEdBQUcsSUFBSSxFQUNuQixVQUFVLEdBQUcsR0FBRyxFQUNoQixXQUFXLEdBQUcsQ0FBQyxFQUNmLFNBQVMsS0FTUCxF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