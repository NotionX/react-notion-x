import type * as notion from 'notion-types'

export interface SignedUrlRequest {
  permissionRecord: PermissionRecord
  url: string
}

export interface PermissionRecord {
  table: string
  id: notion.ID
}

export interface SignedUrlResponse {
  signedUrls: string[]
}

export interface CustomEmoji {
  id: string
  name: string
  url: string
}

export interface ListCustomEmojisResponse {
  object: 'list'
  type: 'custom_emoji'
  results: CustomEmoji[]
  has_more: boolean
  next_cursor: string | null
}
