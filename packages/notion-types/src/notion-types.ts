// Base Types
// ----------------------------------------------------------------------------

export type ID = string

/** Block colors supported by Notion */
export type Color =
  | 'gray'
  | 'brown'
  | 'orange'
  | 'yellow'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'gray_background'
  | 'brown_background'
  | 'orange_background'
  | 'yellow_background'
  | 'teal_background'
  | 'blue_background'
  | 'purple_background'
  | 'pink_background'
  | 'red_background'

/** Types of structured data supported by Notion collections */
export type PropertyType =
  | 'title'
  | 'text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'person'
  | 'file'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'

/** Types of number formatting supported by Notion */
export type NumberFormat =
  | 'number_with_commas'
  | 'percent'
  | 'dollar'
  | 'euro'
  | 'pound'
  | 'yen'
  | 'rupee'
  | 'won'
  | 'yuan'

/** Types of collection views supported by Notion */
export type CollectionViewType =
  | 'table'
  | 'gallery'
  | 'list'
  | 'board'
  | 'calendar'

export type Role = 'editor' | 'reader' | 'none' | 'read_and_write'

export type BoldFormat = ['b']
export type ItalicFormat = ['i']
export type StrikeFormat = ['s']
export type CodeFormat = ['c']
export type LinkFormat = ['a', string]
export type ColorFormat = ['h', Color]
export type UserFormat = ['u', string]
export type PageFormat = ['p', string]
export type DateFormat = [
  'd',
  {
    type: 'date' | 'daterange'
    start_date: string
    end_date?: string
    date_format: string
  }
]

export type SubDecoration =
  | BoldFormat
  | ItalicFormat
  | StrikeFormat
  | CodeFormat
  | LinkFormat
  | ColorFormat
  | DateFormat
  | UserFormat
  | PageFormat

export type BaseDecoration = [string]
export type AdditionalDecoration = [string, SubDecoration[]]

export type Decoration = BaseDecoration | AdditionalDecoration

// Block Types
// ----------------------------------------------------------------------------

/**
 * Base properties shared by all block types.
 */
export interface BaseBlock {
  id: ID
  version: number
  created_time: number
  last_edited_time: number
  parent_id: ID
  parent_table: string
  alive: boolean
  created_by_table: string
  created_by_id: ID
  last_edited_by_table: string
  last_edited_by_id: ID
  space_id?: ID
  properties?: object
  content?: ID[]
}

export interface BaseTextBlock extends BaseBlock {
  properties?: {
    title: Decoration[]
  }
  format?: {
    block_color: Color
  }
}

export interface BaseContentBlock extends BaseBlock {
  properties: {
    source: string[][]
    caption?: Decoration[]
  }
  format: {
    block_width: number
    block_height: number
    display_source: string
    block_full_width: boolean
    block_page_width: boolean
    block_aspect_ratio: number
    block_preserve_scale: boolean
  }
  file_ids?: string[]
}

export interface PageBlock extends BaseBlock {
  type: 'page'
  properties?: {
    title: Decoration[]
  }
  format: {
    page_full_width?: boolean
    page_small_text?: boolean
    page_cover_position?: number
    block_locked?: boolean
    block_locked_by?: string
    page_cover?: string
    page_icon?: string
  }
  permissions: { role: Role; type: string }[]
  file_ids?: string[]
}

export interface BookmarkBlock extends BaseBlock {
  type: 'bookmark'
  properties: {
    link: Decoration[]
    title: Decoration[]
    description: Decoration[]
  }
  format: {
    block_color?: string
    bookmark_icon: string
    bookmark_cover: string
  }
}

export interface TextBlock extends BaseTextBlock {
  type: 'text'
}

export interface BulletedListBlock extends BaseTextBlock {
  type: 'bulleted_list'
}

export interface NumberedListBlock extends BaseTextBlock {
  type: 'numbered_list'
}

export interface HeaderBlock extends BaseTextBlock {
  type: 'header'
}

export interface SubHeaderBlock extends BaseTextBlock {
  type: 'sub_header'
}

export interface SubSubHeaderBlock extends BaseTextBlock {
  type: 'sub_sub_header'
}

export interface QuoteBlock extends BaseTextBlock {
  type: 'quote'
}

// TODO
export interface TodoBlock extends BaseTextBlock {
  type: 'to_do'
  properties: {
    title: Decoration[]
    checked: (['Yes'] | ['No'])[]
  }
}

export interface DividerBlock extends BaseBlock {
  type: 'divider'
}

export interface ColumnListBlock extends BaseBlock {
  type: 'column_list'
}

export interface ColumnBlock extends BaseBlock {
  type: 'column'
  format: {
    column_ratio: number
  }
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout'
  format: {
    page_icon: string
    block_color: Color
  }
  properties: {
    title: Decoration[]
  }
}

export interface ToggleBlock extends BaseBlock {
  type: 'toggle'
  properties: {
    title: Decoration[]
  }
}

export interface ImageBlock extends BaseContentBlock {
  type: 'image'
}

export interface EmbedBlock extends BaseContentBlock {
  type: 'embed'
}

export interface VideoBlock extends BaseContentBlock {
  type: 'video'
}

export interface CodeBlock extends BaseBlock {
  type: 'code'
  properties: {
    title: Decoration[]
    language: Decoration[]
  }
}

export interface CollectionBlock extends BaseContentBlock {
  type: 'collection_view'
  collection_id: ID
  view_ids: ID[]
}

/** The different block values a block can have. */
export type Block =
  | TextBlock
  | PageBlock
  | BulletedListBlock
  | NumberedListBlock
  | HeaderBlock
  | SubHeaderBlock
  | SubSubHeaderBlock
  | TodoBlock
  | DividerBlock
  | ColumnListBlock
  | ColumnBlock
  | QuoteBlock
  | CodeBlock
  | ImageBlock
  | VideoBlock
  | EmbedBlock
  | CalloutBlock
  | BookmarkBlock
  | ToggleBlock
  | CollectionBlock

// Users
// ----------------------------------------------------------------------------

export interface User {
  id: ID
  version: number
  email: string
  given_name: string
  family_name: string
  profile_photo: string
  onboarding_completed: boolean
  mobile_onboarding_completed: boolean
}

// Collections
// ----------------------------------------------------------------------------

export interface SelectOption {
  id: ID
  color: Color
  value: string
}

export interface CollectionPropertySchema {
  name: string
  type: PropertyType
  options?: SelectOption[]
  number_format?: NumberFormat
}

export interface CollectionPropertySchemaMap {
  [key: string]: CollectionPropertySchema
}

export interface Collection {
  id: ID
  version: number
  name: string[][]
  schema: CollectionPropertySchemaMap
  icon: string
  parent_id: ID
  parent_table: string
  alive: boolean
  copied_from: string
}

// Collection Views
// ----------------------------------------------------------------------------

export type CollectionPropertyID = 'string'

export interface BaseCollectionView {
  id: ID
  type: CollectionViewType
  name: string
  format: any

  version: number
  alive: boolean
  parent_id: ID
  parent_table: string

  query2: {
    // TODO
    aggregations?: object[]
    group_by: CollectionPropertyID
  }
}

export interface TableCollectionView extends BaseCollectionView {
  type: 'table'
  format: {
    table_wrap: boolean
    table_properties: Array<{
      property: CollectionPropertyID
      visible: boolean
      width: number
    }>
  }
  page_sort: ID[]
}

export interface GalleryCollectionView extends BaseCollectionView {
  type: 'gallery'
  format: {
    gallery_cover: {
      type: 'page_cover' | 'page_content'
    }
    gallery_cover_size: 'medium'
    gallery_cover_aspect: 'cover'
    gallery_properties: Array<{
      property: CollectionPropertyID
      visible: boolean
    }>
  }
}

export interface ListCollectionView extends BaseCollectionView {
  type: 'list'
  format: {
    list_properties: Array<{
      property: CollectionPropertyID
      visible: boolean
    }>
  }
}

export interface BoardCollectionView extends BaseCollectionView {
  type: 'board'
  format: {
    board_properties: Array<{
      property: CollectionPropertyID
      visible: boolean
    }>

    board_groups2: Array<{
      property: CollectionPropertyID
      hidden: boolean
      value: {
        type: PropertyType
        value: string

        // TODO: needs testing for more cases
      }
    }>
  }
}

export interface CalendarCollectionView extends BaseCollectionView {
  type: 'calendar'

  // TODO
}

export type CollectionView =
  | TableCollectionView
  | GalleryCollectionView
  | ListCollectionView
  | BoardCollectionView
  | CalendarCollectionView

// Aggregate map types
// ----------------------------------------------------------------------------

export interface NotionMap<T> {
  [key: string]: {
    role: Role
    value: T
  }
}

export type BlockMap = NotionMap<Block>
export type UserMap = NotionMap<User>
export type CollectionMap = NotionMap<Collection>
export type CollectionViewMap = NotionMap<CollectionView>

// Aggregate API types
// ----------------------------------------------------------------------------

export interface RecordMap {
  block: BlockMap
  collection?: CollectionMap
  collection_view?: CollectionViewMap
  notion_user?: UserMap
}

// NOTE: This is not a native Notion type, but rather a convenience type that
// extends Notion's native RecordMap with data for collection instances.
export interface ExtendedRecordMap extends RecordMap {
  collection_query?: {
    [collectionId: string]: {
      [collectionViewId: string]: CollectionQueryResult
    }
  }
}

export interface PageChunk {
  recordMap: RecordMap
  cursor: {
    stack: any[]
  }
}

export interface CollectionInstance {
  recordMap: RecordMap
  result: CollectionQueryResult
}

export interface CollectionQueryResult {
  type: CollectionViewType
  total: number
  blockIds: ID[]
  aggregationResults: Array<{
    type: PropertyType
    value: any
  }>
}

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
