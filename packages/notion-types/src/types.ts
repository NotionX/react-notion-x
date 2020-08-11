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

/** Types of structured data supported by Notion */
export type DataType =
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

type BoldFormat = ['b']
type ItalicFormat = ['i']
type StrikeFormat = ['s']
type CodeFormat = ['c']
type LinkFormat = ['a', string]
type ColorFormat = ['h', Color]
type UserFormat = ['u', string]
type PageFormat = ['p', string]
type DateFormat = [
  'd',
  {
    type: 'date' | 'daterange'
    start_date: string
    end_date?: string
    date_format: string
  }
]

type SubDecoration =
  | BoldFormat
  | ItalicFormat
  | StrikeFormat
  | CodeFormat
  | LinkFormat
  | ColorFormat
  | DateFormat
  | UserFormat
  | PageFormat

type BaseDecoration = [string]
type AdditionalDecoration = [string, SubDecoration[]]

export type Decoration = BaseDecoration | AdditionalDecoration

// Block Types
// ----------------------------------------------------------------------------

/**
 * Base properties that all blocks share.
 */
interface BaseBlockValue {
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
  properties?: any
  content?: ID[]
}

export interface PageBlockValue extends BaseBlockValue {
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
  permissions: { role: string; type: string }[]
  file_ids?: string[]
}

export interface BookmarkBlockValue extends BaseBlockValue {
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

export interface BaseTextBlockValue extends BaseBlockValue {
  properties?: {
    title: Decoration[]
  }
  format?: {
    block_color: Color
  }
}

export interface TextBlockValue extends BaseTextBlockValue {
  type: 'text'
}

export interface BulletedListBlockValue extends BaseTextBlockValue {
  type: 'bulleted_list'
}

export interface NumberedListBlockValue extends BaseTextBlockValue {
  type: 'numbered_list'
}

export interface HeaderBlockValue extends BaseTextBlockValue {
  type: 'header'
}

export interface SubHeaderBlockValue extends BaseTextBlockValue {
  type: 'sub_header'
}

export interface SubSubHeaderBlockValue extends BaseTextBlockValue {
  type: 'sub_sub_header'
}

export interface QuoteBlockValue extends BaseTextBlockValue {
  type: 'quote'
}

export interface TodoBlockValue extends BaseTextBlockValue {
  type: 'to_do'
  properties: {
    title: Decoration[]
    checked: (['Yes'] | ['No'])[]
  }
}

export interface DividerBlockValue extends BaseBlockValue {
  type: 'divider'
}

export interface ColumnListBlockValue extends BaseBlockValue {
  type: 'column_list'
}

export interface ColumnBlockValue extends BaseBlockValue {
  type: 'column'
  format: {
    column_ratio: number
  }
}

export interface CalloutBlockValue extends BaseBlockValue {
  type: 'callout'
  format: {
    page_icon: string
    block_color: Color
  }
  properties: {
    title: Decoration[]
  }
}

export interface ToggleBlockValue extends BaseBlockValue {
  type: 'toggle'
  properties: {
    title: Decoration[]
  }
}

export interface BaseContentBlockValue extends BaseBlockValue {
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

export interface ImageBlockValue extends BaseContentBlockValue {
  type: 'image'
}

export interface EmbedBlockValue extends BaseContentBlockValue {
  type: 'embed'
}

export interface VideoBlockValue extends BaseContentBlockValue {
  type: 'video'
}

export interface CodeBlockValue extends BaseBlockValue {
  type: 'code'
  properties: {
    title: Decoration[]
    language: Decoration[]
  }
}

export interface CollectionBlockValue extends BaseContentBlockValue {
  type: 'collection_view'
  collection_id: ID
  view_ids: ID[]
}

/** The different block values a block can have. */
export type BlockValue =
  | TextBlockValue
  | PageBlockValue
  | BulletedListBlockValue
  | NumberedListBlockValue
  | HeaderBlockValue
  | SubHeaderBlockValue
  | SubSubHeaderBlockValue
  | TodoBlockValue
  | DividerBlockValue
  | ColumnListBlockValue
  | ColumnBlockValue
  | QuoteBlockValue
  | CodeBlockValue
  | ImageBlockValue
  | VideoBlockValue
  | EmbedBlockValue
  | CalloutBlockValue
  | BookmarkBlockValue
  | ToggleBlockValue
  | CollectionBlockValue

export interface Block {
  role: string
  value: BlockValue
}

export interface User {
  role: string
  value: {
    id: ID
    version: number
    email: string
    given_name: string
    family_name: string
    profile_photo: string
    onboarding_completed: boolean
    mobile_onboarding_completed: boolean
  }
}

export type BlockMap = {
  [key: string]: Block
}

export type UserMap = {
  [key: string]: User
}

// Collections
// ----------------------------------------------------------------------------

export interface BaseCollectionViewValue {}

export interface TableCollectionViewValue extends BaseCollectionViewValue {
  type: 'table'
  format: {
    table_wrap: boolean
    table_properties: Array<{
      visible: boolean
      property: string
      width: number
    }>
  }
}

export interface GalleryCollectionViewValue extends BaseCollectionViewValue {
  type: 'gallery'
  format: {
    gallery_cover: {
      type: 'page_cover'
    }
    gallery_cover_aspect: 'cover'
    gallery_properties: Array<{ visible: boolean; property: string }>
  }
}

export type CollectionViewValue =
  | TableCollectionViewValue
  | GalleryCollectionViewValue

export interface CollectionDataRow {
  [key: string]: Decoration[] | string
}

export interface SelectOption {
  id: ID
  color: Color
  value: string
}

export interface ColumnSchema {
  name: string
  type: DataType
  options?: SelectOption[]
  number_format?: NumberFormat
}

export interface CollectionValue {
  id: ID
  version: number
  name: string[][]
  schema: ColumnSchemaMap
  icon: string
  parent_id: ID
  parent_table: string
  alive: boolean
  copied_from: string
}

export type CollectionMap = {
  [key: string]: Collection
}

export type CollectionViewMap = {
  [key: string]: CollectionView
}

export interface ColumnSchemaMap {
  [key: string]: ColumnSchema
}

export interface Collection {
  role: string
  value: CollectionValue
}

export interface CollectionView {
  role: string
  value: CollectionViewValue
}

export interface RecordMap {
  block: BlockMap
  notion_user: UserMap
  collection: CollectionMap
  collection_view: CollectionViewMap
}
