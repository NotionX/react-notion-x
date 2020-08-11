import { BlockMap } from 'notion-types'

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
  recordMap: {
    block: BlockMap
  }
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
