import type { Client } from '@notionhq/client'

// Raw V1 API response types - no adaptation, preserve all data as-is
export type V1PageResponse = Awaited<
  ReturnType<InstanceType<typeof Client>['pages']['retrieve']>
>

export type V1BlockResponse = Awaited<
  ReturnType<InstanceType<typeof Client>['blocks']['retrieve']>
>

export type V1BlockChildrenResponse = Awaited<
  ReturnType<InstanceType<typeof Client>['blocks']['children']['list']>
>

export type V1DatabaseResponse = Awaited<
  ReturnType<InstanceType<typeof Client>['databases']['retrieve']>
>

export type V1DatabaseQueryResponse = Awaited<
  ReturnType<InstanceType<typeof Client>['databases']['query']>
>

export type V1UserResponse = Awaited<
  ReturnType<InstanceType<typeof Client>['users']['retrieve']>
>

export type V1SearchResponse = Awaited<
  ReturnType<InstanceType<typeof Client>['search']>
>

// Raw data containers - no conversion, just organization
export interface V1RawPageData {
  page: V1PageResponse
  rootBlock: V1BlockResponse
  allBlocks: Record<string, V1BlockResponse>
  allPages: Record<string, V1PageResponse>
  allDatabases: Record<string, V1DatabaseResponse>
  blockChildren: Record<string, string[]>
  parentMap: Record<string, string>
  users: Record<string, V1UserResponse>
  metadata: {
    fetchedAt: string
    pageId: string
    totalBlocks: number
    totalPages: number
    totalDatabases: number
  }
}

// Configuration options
export interface V1ClientOptions {
  concurrency?: number
  maxDepth?: number
  fetchUsers?: boolean
  fetchDatabases?: boolean
  includeMetadata?: boolean
}

// Error types
export interface V1ClientError {
  type:
    | 'API_ERROR'
    | 'RATE_LIMIT'
    | 'PERMISSION_DENIED'
    | 'NOT_FOUND'
    | 'UNKNOWN'
  message: string
  blockId?: string
  pageId?: string
  originalError?: any
}
