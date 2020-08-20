import { RecordMap } from './maps'

// API types
// ----------------------------------------------------------------------------

export interface RecordValues<T> {
  results: T[]
}

export interface SearchParams {
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

export interface SearchResults {
  recordMap: RecordMap
  results: SearchResult[]
  total: number
}

export interface SearchResult {
  id: string
  isNavigable: boolean
  score: number
  highlight: {
    pathText: string
    text: string
  }
}

export interface APIError {
  errorId: string
  name: string
  message: string
}
