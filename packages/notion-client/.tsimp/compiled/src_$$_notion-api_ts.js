import got, {} from 'got';
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
    constructor({ apiBaseUrl = 'https://www.notion.so/api/v3', authToken, activeUser, userTimeZone = 'America/New_York' } = {}) {
        this._apiBaseUrl = apiBaseUrl;
        this._authToken = authToken;
        this._activeUser = activeUser;
        this._userTimeZone = userTimeZone;
    }
    async getPage(pageId, { concurrency = 3, fetchMissingBlocks = true, fetchCollections = true, signFileUrls = true, chunkLimit = 100, chunkNumber = 0, gotOptions } = {}) {
        const page = await this.getPageRaw(pageId, {
            chunkLimit,
            chunkNumber,
            gotOptions
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
                const newBlocks = await this.getBlocks(pendingBlockIds, gotOptions).then((res) => res.recordMap.block);
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
                        gotOptions
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
            await this.addSignedUrls({ recordMap, contentBlockIds, gotOptions });
        }
        return recordMap;
    }
    async addSignedUrls({ recordMap, contentBlockIds, gotOptions = {} }) {
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
                const { signedUrls } = await this.getSignedFileUrls(allFileInstances, gotOptions);
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
    async getPageRaw(pageId, { gotOptions, chunkLimit = 100, chunkNumber = 0 } = {}) {
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
            gotOptions
        });
    }
    async getCollectionData(collectionId, collectionViewId, collectionView, { limit = 9999, searchQuery = '', userTimeZone = this._userTimeZone, loadContentCover = true, gotOptions } = {}) {
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
            gotOptions
        });
    }
    async getUsers(userIds, gotOptions) {
        return this.fetch({
            endpoint: 'getRecordValues',
            body: {
                requests: userIds.map((id) => ({ id, table: 'notion_user' }))
            },
            gotOptions
        });
    }
    async getBlocks(blockIds, gotOptions) {
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
            gotOptions
        });
    }
    async getSignedFileUrls(urls, gotOptions) {
        return this.fetch({
            endpoint: 'getSignedFileUrls',
            body: {
                urls
            },
            gotOptions
        });
    }
    async search(params, gotOptions) {
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
            gotOptions
        });
    }
    async fetch({ endpoint, body, gotOptions, headers: clientHeaders }) {
        const headers = {
            ...clientHeaders,
            ...gotOptions?.headers,
            'Content-Type': 'application/json'
        };
        if (this._authToken) {
            headers.cookie = `token_v2=${this._authToken}`;
        }
        if (this._activeUser) {
            headers['x-notion-active-user-header'] = this._activeUser;
        }
        const url = `${this._apiBaseUrl}/${endpoint}`;
        return got
            .post(url, {
            ...gotOptions,
            json: body,
            headers
        })
            .json();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aW9uLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvdGZpc2NoZXIvZGV2L21vZHVsZXMvcmVhY3Qtbm90aW9uLXgvcGFja2FnZXMvbm90aW9uLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJub3Rpb24tYXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sR0FBRyxFQUFFLEVBQWtDLE1BQU0sS0FBSyxDQUFBO0FBQ3pELE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIsc0JBQXNCLEVBQ3RCLFdBQVcsRUFDWCxRQUFRLEVBQ1QsTUFBTSxjQUFjLENBQUE7QUFDckIsT0FBTyxJQUFJLE1BQU0sT0FBTyxDQUFBO0FBSXhCOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFNBQVM7SUFDSCxXQUFXLENBQVE7SUFDbkIsVUFBVSxDQUFTO0lBQ25CLFdBQVcsQ0FBUztJQUNwQixhQUFhLENBQVE7SUFFdEMsWUFBWSxFQUNWLFVBQVUsR0FBRyw4QkFBOEIsRUFDM0MsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEdBQUcsa0JBQWtCLEtBTy9CLEVBQUU7UUFDSixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQTtRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQTtRQUMzQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQTtRQUM3QixJQUFJLENBQUMsYUFBYSxHQUFHLFlBQVksQ0FBQTtJQUNuQyxDQUFDO0lBRU0sS0FBSyxDQUFDLE9BQU8sQ0FDbEIsTUFBYyxFQUNkLEVBQ0UsV0FBVyxHQUFHLENBQUMsRUFDZixrQkFBa0IsR0FBRyxJQUFJLEVBQ3pCLGdCQUFnQixHQUFHLElBQUksRUFDdkIsWUFBWSxHQUFHLElBQUksRUFDbkIsVUFBVSxHQUFHLEdBQUcsRUFDaEIsV0FBVyxHQUFHLENBQUMsRUFDZixVQUFVLEtBU1IsRUFBRTtRQUVOLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDekMsVUFBVTtZQUNWLFdBQVc7WUFDWCxVQUFVO1NBQ1gsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxFQUFFLFNBQXFDLENBQUE7UUFFN0QsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2hFLENBQUM7UUFFRCx1Q0FBdUM7UUFDdkMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQTtRQUNqRCxTQUFTLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFBO1FBQzNELFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUE7UUFFbkQsNENBQTRDO1FBQzVDLDRDQUE0QztRQUM1QyxTQUFTLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFBO1FBQy9CLFNBQVMsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBO1FBRTFCLElBQUksa0JBQWtCLEVBQUUsQ0FBQztZQUN2QixpREFBaUQ7WUFDakQsT0FBTyxJQUFJLEVBQUUsQ0FBQztnQkFDWixtQ0FBbUM7Z0JBQ25DLE1BQU0sZUFBZSxHQUFHLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FDOUQsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FDN0IsQ0FBQTtnQkFFRCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUM1QixNQUFLO2dCQUNQLENBQUM7Z0JBRUQsTUFBTSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUNwQyxlQUFlLEVBQ2YsVUFBVSxDQUNYLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dCQUVwQyxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQUUsR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsU0FBUyxFQUFFLENBQUE7WUFDeEQsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLGVBQWUsR0FBRyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUV6RCxpRkFBaUY7UUFDakYsb0ZBQW9GO1FBQ3BGLGdGQUFnRjtRQUNoRixpRkFBaUY7UUFDakYsb0JBQW9CO1FBQ3BCLElBQUksZ0JBQWdCLEVBQUUsQ0FBQztZQUNyQixNQUFNLHNCQUFzQixHQUd2QixlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ3ZDLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFBO2dCQUM3QyxNQUFNLFlBQVksR0FDaEIsS0FBSztvQkFDTCxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssaUJBQWlCO3dCQUMvQixLQUFLLENBQUMsSUFBSSxLQUFLLHNCQUFzQixDQUFDO29CQUN4QyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUE7Z0JBRXhDLElBQUksWUFBWSxFQUFFLENBQUM7b0JBQ2pCLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDaEQsWUFBWTt3QkFDWixnQkFBZ0I7cUJBQ2pCLENBQUMsQ0FBQyxDQUFBO2dCQUNMLENBQUM7cUJBQU0sQ0FBQztvQkFDTixPQUFPLEVBQUUsQ0FBQTtnQkFDWCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUE7WUFFRiwrQ0FBK0M7WUFDL0MsTUFBTSxJQUFJLENBQ1Isc0JBQXNCLEVBQ3RCLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxFQUFFO2dCQUMzQixNQUFNLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsa0JBQWtCLENBQUE7Z0JBQzdELE1BQU0sY0FBYyxHQUNsQixTQUFTLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsS0FBSyxDQUFBO2dCQUVwRCxJQUFJLENBQUM7b0JBQ0gsTUFBTSxjQUFjLEdBQUcsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQ2pELFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsY0FBYyxFQUNkO3dCQUNFLFVBQVU7cUJBQ1gsQ0FDRixDQUFBO29CQUVELHNCQUFzQjtvQkFDdEIsZ0RBQWdEO29CQUNoRCxtREFBbUQ7b0JBQ25ELElBQUk7b0JBRUosU0FBUyxDQUFDLEtBQUssR0FBRzt3QkFDaEIsR0FBRyxTQUFTLENBQUMsS0FBSzt3QkFDbEIsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLEtBQUs7cUJBQ2xDLENBQUE7b0JBRUQsU0FBUyxDQUFDLFVBQVUsR0FBRzt3QkFDckIsR0FBRyxTQUFTLENBQUMsVUFBVTt3QkFDdkIsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLFVBQVU7cUJBQ3ZDLENBQUE7b0JBRUQsU0FBUyxDQUFDLGVBQWUsR0FBRzt3QkFDMUIsR0FBRyxTQUFTLENBQUMsZUFBZTt3QkFDNUIsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLGVBQWU7cUJBQzVDLENBQUE7b0JBRUQsU0FBUyxDQUFDLFdBQVcsR0FBRzt3QkFDdEIsR0FBRyxTQUFTLENBQUMsV0FBVzt3QkFDeEIsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLFdBQVc7cUJBQ3hDLENBQUE7b0JBRUQsU0FBUyxDQUFDLGdCQUFpQixDQUFDLFlBQVksQ0FBQyxHQUFHO3dCQUMxQyxHQUFHLFNBQVMsQ0FBQyxnQkFBaUIsQ0FBQyxZQUFZLENBQUM7d0JBQzVDLENBQUMsZ0JBQWdCLENBQUMsRUFBRyxjQUFjLENBQUMsTUFBYyxFQUFFLGNBQWM7cUJBQ25FLENBQUE7Z0JBQ0gsQ0FBQztnQkFBQyxPQUFPLEdBQVEsRUFBRSxDQUFDO29CQUNsQiwrRUFBK0U7b0JBQy9FLDZCQUE2QjtvQkFDN0IsT0FBTyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO29CQUNwRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNwQixDQUFDO1lBQ0gsQ0FBQyxFQUNEO2dCQUNFLFdBQVc7YUFDWixDQUNGLENBQUE7UUFDSCxDQUFDO1FBRUQsdURBQXVEO1FBQ3ZELG1GQUFtRjtRQUNuRixtRkFBbUY7UUFDbkYsK0JBQStCO1FBQy9CLElBQUksWUFBWSxFQUFFLENBQUM7WUFDakIsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQ3RFLENBQUM7UUFFRCxPQUFPLFNBQVMsQ0FBQTtJQUNsQixDQUFDO0lBRU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUN6QixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsR0FBRyxFQUFFLEVBS2hCO1FBQ0MsU0FBUyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUE7UUFFMUIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3JCLGVBQWUsR0FBRyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNyRCxDQUFDO1FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDM0QsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUE7WUFFN0MsSUFDRSxLQUFLO2dCQUNMLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxLQUFLO29CQUNuQixLQUFLLENBQUMsSUFBSSxLQUFLLE9BQU87b0JBQ3RCLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7b0JBQ2xELEtBQUssQ0FBQyxJQUFJLEtBQUssT0FBTztvQkFDdEIsS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNO29CQUNyQixLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxFQUN4QixDQUFDO2dCQUNELE1BQU0sTUFBTSxHQUNWLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTTtvQkFDbkIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVTtvQkFDMUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDeEMsNkJBQTZCO2dCQUU3QixJQUFJLE1BQU0sRUFBRSxDQUFDO29CQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDLEVBQUUsQ0FBQzt3QkFDakQsT0FBTyxFQUFFLENBQUE7b0JBQ1gsQ0FBQztvQkFFRCxPQUFPO3dCQUNMLGdCQUFnQixFQUFFOzRCQUNoQixLQUFLLEVBQUUsT0FBTzs0QkFDZCxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUU7eUJBQ2I7d0JBQ0QsR0FBRyxFQUFFLE1BQU07cUJBQ1osQ0FBQTtnQkFDSCxDQUFDO1lBQ0gsQ0FBQztZQUVELE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUM7Z0JBQ0gsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUNqRCxnQkFBZ0IsRUFDaEIsVUFBVSxDQUNYLENBQUE7Z0JBRUQsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUNsRCxLQUFLLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQzt3QkFDbkQsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUMvQixJQUFJLENBQUMsU0FBUzs0QkFBRSxTQUFRO3dCQUV4QixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFBO3dCQUN4QyxJQUFJLENBQUMsT0FBTzs0QkFBRSxTQUFRO3dCQUV0QixTQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLFNBQVMsQ0FBQTtvQkFDNUMsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztZQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2IsT0FBTyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUN4RCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsVUFBVSxDQUNyQixNQUFjLEVBQ2QsRUFDRSxVQUFVLEVBQ1YsVUFBVSxHQUFHLEdBQUcsRUFDaEIsV0FBVyxHQUFHLENBQUMsS0FLYixFQUFFO1FBRU4sTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRXhDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNsQixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixNQUFNLEdBQUcsQ0FBQyxDQUFBO1FBQ3RELENBQUM7UUFFRCxNQUFNLElBQUksR0FBRztZQUNYLE1BQU0sRUFBRSxZQUFZO1lBQ3BCLEtBQUssRUFBRSxVQUFVO1lBQ2pCLFdBQVc7WUFDWCxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ3JCLGVBQWUsRUFBRSxLQUFLO1NBQ3ZCLENBQUE7UUFFRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQW1CO1lBQ2xDLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLElBQUk7WUFDSixVQUFVO1NBQ1gsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxpQkFBaUIsQ0FDNUIsWUFBb0IsRUFDcEIsZ0JBQXdCLEVBQ3hCLGNBQW1CLEVBQ25CLEVBQ0UsS0FBSyxHQUFHLElBQUksRUFDWixXQUFXLEdBQUcsRUFBRSxFQUNoQixZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFDakMsZ0JBQWdCLEdBQUcsSUFBSSxFQUN2QixVQUFVLEtBU1IsRUFBRTtRQUVOLE1BQU0sSUFBSSxHQUFHLGNBQWMsRUFBRSxJQUFJLENBQUE7UUFDakMsTUFBTSxXQUFXLEdBQUcsSUFBSSxLQUFLLE9BQU8sQ0FBQTtRQUNwQyxNQUFNLE9BQU8sR0FBRyxXQUFXO1lBQ3pCLENBQUMsQ0FBQyxjQUFjLEVBQUUsTUFBTSxFQUFFLGdCQUFnQjtZQUMxQyxDQUFDLENBQUMsY0FBYyxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsQ0FBQTtRQUUvQyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7UUFDaEIsSUFBSSxjQUFjLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLENBQUM7WUFDN0MsT0FBTyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxDQUNuRCxDQUFDLFNBQWMsRUFBRSxFQUFFO2dCQUNqQixzQkFBc0I7Z0JBQ3RCLE9BQU87b0JBQ0wsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTTtvQkFDakMsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsUUFBUTtpQkFDdEMsQ0FBQTtZQUNILENBQUMsQ0FDRixDQUFBO1FBQ0gsQ0FBQztRQUVELHdDQUF3QztRQUN4QyxJQUFJLGNBQWMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN2RCxDQUFDO1FBRUQsSUFBSSxNQUFNLEdBQVE7WUFDaEIsSUFBSSxFQUFFLFNBQVM7WUFDZixRQUFRLEVBQUU7Z0JBQ1Isd0JBQXdCLEVBQUU7b0JBQ3hCLElBQUksRUFBRSxTQUFTO29CQUNmLEtBQUs7b0JBQ0wsZ0JBQWdCO2lCQUNqQjthQUNGO1lBQ0QsSUFBSSxFQUFFLEVBQUU7WUFDUixHQUFHLGNBQWMsRUFBRSxNQUFNO1lBQ3pCLE1BQU0sRUFBRTtnQkFDTixPQUFPO2dCQUNQLFFBQVEsRUFBRSxLQUFLO2FBQ2hCO1lBQ0QsV0FBVztZQUNYLFlBQVk7U0FDYixDQUFBO1FBRUQsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNaLE1BQU0sTUFBTSxHQUNWLGNBQWMsRUFBRSxNQUFNLEVBQUUsYUFBYTtnQkFDckMsY0FBYyxFQUFFLE1BQU0sRUFBRSxpQkFBaUI7Z0JBQ3pDLEVBQUUsQ0FBQTtZQUNKLE1BQU0sU0FBUyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBQzFFLE1BQU0sU0FBUyxHQUFHO2dCQUNoQixRQUFRLEVBQUUsYUFBYTtnQkFDdkIsR0FBRyxFQUFFLG9CQUFvQjtnQkFDekIsSUFBSSxFQUFFLG9CQUFvQjtnQkFDMUIsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLFlBQVksRUFBRSxlQUFlO2dCQUM3QixZQUFZLEVBQUUsZ0JBQWdCO2dCQUM5QixTQUFTLEVBQUUsVUFBVTthQUN0QixDQUFBO1lBRUQsTUFBTSxhQUFhLEdBQXdCLEVBQUUsQ0FBQTtZQUM3QyxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRSxDQUFDO2dCQUMzQixNQUFNLEVBQ0osUUFBUSxFQUNSLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFDdkIsR0FBRyxLQUFLLENBQUE7Z0JBRVQsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUUsQ0FBQztvQkFDakMsTUFBTSxhQUFhLEdBQ2pCLFFBQVEsS0FBSyxTQUFTO3dCQUNwQixDQUFDLENBQUM7NEJBQ0UsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsS0FBSzt5QkFDTjt3QkFDSCxDQUFDLENBQUM7NEJBQ0UsSUFBSSxFQUFFLGFBQWE7NEJBQ25CLFdBQVcsRUFBRTtnQ0FDWCxVQUFVLEVBQUUsT0FBTzs2QkFDcEI7eUJBQ0YsQ0FBQTtvQkFFUCxNQUFNLG9CQUFvQixHQUFHLEtBQUssS0FBSyxTQUFTLENBQUE7b0JBQ2hELE1BQU0sV0FBVyxHQUFHLEtBQUssRUFBRSxLQUFLLENBQUE7b0JBQ2hDLDhCQUE4QjtvQkFDOUIsTUFBTSxVQUFVLEdBQUcsb0JBQW9CO3dCQUNyQyxDQUFDLENBQUMsZUFBZTt3QkFDakIsQ0FBQyxDQUFDLFdBQVc7NEJBQ1gsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBVSxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUTs0QkFDbEQsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLElBQUksS0FBSyxDQUFBO29CQUUzQixNQUFNLFVBQVUsR0FDZCxDQUFDLG9CQUFvQixJQUFJLENBQUMsV0FBVyxJQUFJLEtBQUssRUFBRSxLQUFLLElBQUksS0FBSyxDQUFDLENBQUE7b0JBRWpFLGFBQWEsQ0FBQyxHQUFHLFFBQVEsSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFLENBQUMsR0FBRzt3QkFDbkQsR0FBRyxhQUFhO3dCQUNoQixNQUFNLEVBQUU7NEJBQ04sUUFBUSxFQUFFLEtBQUs7NEJBQ2YsT0FBTyxFQUFFO2dDQUNQO29DQUNFLFFBQVE7b0NBQ1IsTUFBTSxFQUFFO3dDQUNOLFFBQVEsRUFBRSxDQUFDLG9CQUFvQjs0Q0FDN0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUE4QixDQUFDOzRDQUMzQyxDQUFDLENBQUMsVUFBVTt3Q0FDZCxHQUFHLENBQUMsQ0FBQyxvQkFBb0IsSUFBSTs0Q0FDM0IsS0FBSyxFQUFFO2dEQUNMLElBQUksRUFBRSxPQUFPO2dEQUNiLEtBQUssRUFBRSxVQUFVOzZDQUNsQjt5Q0FDRixDQUFDO3FDQUNIO2lDQUNGOzZCQUNGO3lCQUNGO3FCQUNGLENBQUE7Z0JBQ0gsQ0FBQztZQUNILENBQUM7WUFFRCxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLFNBQVMsQ0FBQTtZQUNyRSxNQUFNLEdBQUc7Z0JBQ1AsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsUUFBUSxFQUFFO29CQUNSLENBQUMsWUFBWSxDQUFDLEVBQUU7d0JBQ2QsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsT0FBTzt3QkFDUCxHQUFHLENBQUMsY0FBYyxFQUFFLE1BQU0sRUFBRSxNQUFNLElBQUk7NEJBQ3BDLE1BQU0sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU07eUJBQ3ZDLENBQUM7d0JBQ0YsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQVUsRUFBRSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQzt3QkFDN0QsS0FBSztxQkFDTjtvQkFDRCxHQUFHLGFBQWE7aUJBQ2pCO2dCQUNELEdBQUcsY0FBYyxFQUFFLE1BQU07Z0JBQ3pCLFdBQVc7Z0JBQ1gsWUFBWTtnQkFDWix3QkFBd0I7Z0JBQ3hCLE1BQU0sRUFBRTtvQkFDTixPQUFPO29CQUNQLFFBQVEsRUFBRSxLQUFLO2lCQUNoQjthQUNGLENBQUE7UUFDSCxDQUFDO1FBRUQscUJBQXFCO1FBQ3JCLGlCQUFpQjtRQUNqQixzQkFBc0I7UUFDdEIsVUFBVTtRQUNWLHdCQUF3QjtRQUN4Qiw0QkFBNEI7UUFDNUIsa0JBQWtCO1FBQ2xCLHNDQUFzQztRQUN0QywrREFBK0Q7UUFDL0QsV0FBVztRQUNYLGNBQWM7UUFDZCxVQUFVO1FBQ1YsUUFBUTtRQUNSLE1BQU07UUFDTixJQUFJO1FBRUosT0FBTyxJQUFJLENBQUMsS0FBSyxDQUE0QjtZQUMzQyxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLElBQUksRUFBRTtnQkFDSixVQUFVLEVBQUU7b0JBQ1YsRUFBRSxFQUFFLFlBQVk7aUJBQ2pCO2dCQUNELGNBQWMsRUFBRTtvQkFDZCxFQUFFLEVBQUUsZ0JBQWdCO2lCQUNyQjtnQkFDRCxNQUFNO2FBQ1A7WUFDRCxVQUFVO1NBQ1gsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxRQUFRLENBQ25CLE9BQWlCLEVBQ2pCLFVBQXNDO1FBRXRDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBbUM7WUFDbEQsUUFBUSxFQUFFLGlCQUFpQjtZQUMzQixJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7YUFDOUQ7WUFDRCxVQUFVO1NBQ1gsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVNLEtBQUssQ0FBQyxTQUFTLENBQ3BCLFFBQWtCLEVBQ2xCLFVBQXNDO1FBRXRDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBbUI7WUFDbEMsUUFBUSxFQUFFLGtCQUFrQjtZQUM1QixJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ25DLDhDQUE4QztvQkFDOUMsS0FBSyxFQUFFLE9BQU87b0JBQ2QsRUFBRSxFQUFFLE9BQU87b0JBQ1gsT0FBTyxFQUFFLENBQUMsQ0FBQztpQkFDWixDQUFDLENBQUM7YUFDSjtZQUNELFVBQVU7U0FDWCxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLGlCQUFpQixDQUM1QixJQUE4QixFQUM5QixVQUFzQztRQUV0QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQTBCO1lBQ3pDLFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsSUFBSSxFQUFFO2dCQUNKLElBQUk7YUFDTDtZQUNELFVBQVU7U0FDWCxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLE1BQU0sQ0FDakIsTUFBMkIsRUFDM0IsVUFBc0M7UUFFdEMsTUFBTSxJQUFJLEdBQUc7WUFDWCxJQUFJLEVBQUUsa0JBQWtCO1lBQ3hCLE1BQU0sRUFBRSxtQkFBbUI7WUFDM0IsVUFBVSxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQzFDLElBQUksRUFBRTtnQkFDSixLQUFLLEVBQUUsV0FBVzthQUNuQjtZQUNELEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDekIsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxhQUFhLEVBQUUsS0FBSztnQkFDcEIsZUFBZSxFQUFFLEtBQUs7Z0JBQ3RCLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLHNCQUFzQixFQUFFLEtBQUs7Z0JBQzdCLFNBQVMsRUFBRSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxFQUFFO2dCQUNiLFFBQVEsRUFBRSxFQUFFO2dCQUNaLGNBQWMsRUFBRSxFQUFFO2dCQUNsQixXQUFXLEVBQUUsRUFBRTtnQkFDZixHQUFHLE1BQU0sQ0FBQyxPQUFPO2FBQ2xCO1NBQ0YsQ0FBQTtRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBdUI7WUFDdEMsUUFBUSxFQUFFLFFBQVE7WUFDbEIsSUFBSTtZQUNKLFVBQVU7U0FDWCxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU0sS0FBSyxDQUFDLEtBQUssQ0FBSSxFQUNwQixRQUFRLEVBQ1IsSUFBSSxFQUNKLFVBQVUsRUFDVixPQUFPLEVBQUUsYUFBYSxFQU12QjtRQUNDLE1BQU0sT0FBTyxHQUFRO1lBQ25CLEdBQUcsYUFBYTtZQUNoQixHQUFHLFVBQVUsRUFBRSxPQUFPO1lBQ3RCLGNBQWMsRUFBRSxrQkFBa0I7U0FDbkMsQ0FBQTtRQUVELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxNQUFNLEdBQUcsWUFBWSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7UUFDaEQsQ0FBQztRQUVELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JCLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUE7UUFDM0QsQ0FBQztRQUVELE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxRQUFRLEVBQUUsQ0FBQTtRQUU3QyxPQUFPLEdBQUc7YUFDUCxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1QsR0FBRyxVQUFVO1lBQ2IsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPO1NBQ1IsQ0FBQzthQUNELElBQUksRUFBRSxDQUFBO1FBRVQsc0JBQXNCO1FBQ3RCLG9CQUFvQjtRQUNwQixnQ0FBZ0M7UUFDaEMsWUFBWTtRQUNaLHFCQUFxQjtRQUNyQiwrQkFBK0I7UUFDL0Isc0JBQXNCO1FBQ3RCLEtBQUs7SUFDUCxDQUFDO0NBQ0YifQ==