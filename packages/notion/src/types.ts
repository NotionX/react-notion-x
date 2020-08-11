import * as types from 'notion-types'

export interface RecordMap {
  block: types.BlockMap
  collection: types.CollectionMap
  collection_view: types.CollectionViewMap
  notion_user: types.UserMap
}

export interface NotionSearchParams {
  ancestorId: string
  query: string
  filters?: {
    isDeletedOnly: boolean
    excludeTemplates: boolean
    isNavigableOnly: boolean
    requireEditPermissions: boolean
  }
  limit?: number
}

export interface NotionSearchResults {
  recordMap: RecordMap
  results: NotionSearchResult[]
  total: number
}

export interface NotionSearchResult {
  id: string
  isNavigable: boolean
  score: number
  highlight: {
    pathText: string
    text: string
  }
}
