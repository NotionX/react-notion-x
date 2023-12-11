import { Color, Decoration, ID, Role } from './core'

export type BlockType =
  | 'page'
  | 'text'
  | 'bookmark'
  | 'bulleted_list'
  | 'numbered_list'
  | 'header'
  | 'sub_header'
  | 'sub_sub_header'
  | 'quote'
  | 'equation'
  | 'to_do'
  | 'table_of_contents'
  | 'divider'
  | 'column_list'
  | 'column'
  | 'callout'
  | 'toggle'
  | 'image'
  | 'embed'
  | 'gist'
  | 'video'
  | 'figma'
  | 'typeform'
  | 'replit'
  | 'codepen'
  | 'excalidraw'
  | 'tweet'
  | 'maps'
  | 'pdf'
  | 'audio'
  | 'drive'
  | 'file'
  | 'code'
  | 'collection_view'
  | 'collection_view_page'
  | 'transclusion_container'
  | 'transclusion_reference'
  | 'alias'
  | 'table'
  | 'table_row'
  | 'external_object_instance'
  | 'breadcrumb'
  | 'miro'
  // fallback for unknown blocks
  | string

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
  | TableOfContentsBlock
  | DividerBlock
  | ColumnListBlock
  | ColumnBlock
  | QuoteBlock
  | EquationBlock
  | CodeBlock
  | ImageBlock
  | VideoBlock
  | FigmaBlock
  | TypeformBlock
  | ReplitBlock
  | CodepenBlock
  | ExcalidrawBlock
  | TweetBlock
  | PdfBlock
  | MapsBlock
  | AudioBlock
  | GoogleDriveBlock
  | FileBlock
  | EmbedBlock
  | GistBlock
  | CalloutBlock
  | BookmarkBlock
  | ToggleBlock
  | CollectionViewBlock
  | CollectionViewPageBlock
  | SyncBlock
  | SyncPointerBlock
  | PageLink
  | TableBlock
  | TableRowBlock
  | ExternalObjectInstance
  | BreadcrumbInstance

/**
 * Base properties shared by all blocks.
 */
export interface BaseBlock {
  id: ID
  type: BlockType
  properties?: any
  format?: any
  content?: ID[]

  space_id?: ID
  parent_id: ID
  parent_table: string | 'space' | 'block' | 'table'

  version: number
  created_time: number
  last_edited_time: number
  alive: boolean
  created_by_table: string
  created_by_id: ID
  last_edited_by_table: string
  last_edited_by_id: ID
}

export interface BaseTextBlock extends BaseBlock {
  // some text blocks occasionally have children
  content?: ID[]
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
  format?: {
    block_alignment: 'center' | 'left' | 'right'
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

export interface BasePageBlock extends BaseBlock {
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
    block_color?: Color
  }
  permissions: { role: Role; type: string }[]
  file_ids?: string[]
}

export interface PageBlock extends BasePageBlock {
  type: 'page'
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
  format?: {
    block_color: Color
    toggleable?: boolean
  }
}

export interface SubHeaderBlock extends BaseTextBlock {
  type: 'sub_header'
  format?: {
    block_color: Color
    toggleable?: boolean
  }
}

export interface SubSubHeaderBlock extends BaseTextBlock {
  type: 'sub_sub_header'
  format?: {
    block_color: Color
    toggleable?: boolean
  }
}

export interface QuoteBlock extends BaseTextBlock {
  type: 'quote'
}

export interface EquationBlock extends BaseTextBlock {
  type: 'equation'
}

// TODO
export interface TodoBlock extends BaseTextBlock {
  type: 'to_do'
  properties: {
    title: Decoration[]
    checked: (['Yes'] | ['No'])[]
  }
}

export interface TableOfContentsBlock extends BaseBlock {
  type: 'table_of_contents'
  format?: {
    block_color: Color
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

export interface GistBlock extends BaseContentBlock {
  type: 'gist'
}

export interface VideoBlock extends BaseContentBlock {
  type: 'video'
}

export interface FigmaBlock extends BaseContentBlock {
  type: 'figma'
}

export interface TypeformBlock extends BaseContentBlock {
  type: 'typeform'
}

export interface ReplitBlock extends BaseContentBlock {
  type: 'replit'
}

export interface CodepenBlock extends BaseContentBlock {
  type: 'codepen'
}

export interface ExcalidrawBlock extends BaseContentBlock {
  type: 'excalidraw'
}

export interface TweetBlock extends BaseContentBlock {
  type: 'tweet'
}

export interface MapsBlock extends BaseContentBlock {
  type: 'maps'
}

export interface PdfBlock extends BaseContentBlock {
  type: 'pdf'
}

export interface AudioBlock extends BaseContentBlock {
  type: 'audio'
}

export interface MiroBlock extends BaseContentBlock {
  type: 'miro'
}

export interface FileBlock extends BaseBlock {
  type: 'file'
  properties: {
    title: Decoration[]
    size: Decoration[]
    source: string[][]
  }
  file_ids?: string[]
}

export interface GoogleDriveBlock extends BaseContentBlock {
  type: 'drive'
  format: {
    drive_status: {
      authed: boolean
      last_fetched: number
    }
    drive_properties: {
      url: string
      icon: string
      title: string
      file_id: string
      trashed: boolean
      version: string
      thumbnail: string
      user_name: string
      modified_time: number
    }
    block_alignment: 'center' | 'left' | 'right'
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

export interface CodeBlock extends BaseBlock {
  type: 'code'
  properties: {
    title: Decoration[]
    language: Decoration[]
    caption: Decoration[]
  }
}

export interface CollectionViewBlock extends BaseContentBlock {
  type: 'collection_view'
  collection_id?: ID
  view_ids: ID[]
  format?: BaseContentBlock['format'] & {
    collection_pointer?: {
      id: ID
      spaceId: ID
      table: string
    }
  }
}

export interface CollectionViewPageBlock extends BasePageBlock {
  type: 'collection_view_page'
  collection_id?: ID
  view_ids: ID[]
  format: BasePageBlock['format'] & {
    collection_pointer?: {
      id: ID
      spaceId: ID
      table: string
    }
  }
}

export interface SyncBlock extends BaseBlock {
  type: 'transclusion_container'
}

export interface SyncPointerBlock extends BaseBlock {
  type: 'transclusion_reference'
  format: {
    copied_from_pointer: {
      id: string
      spaceid: string
    }
    transclusion_reference_pointer: {
      id: string
      spaceId: string
    }
  }
}

export interface PageLink extends BaseBlock {
  type: 'alias'
  format: {
    alias_pointer: {
      id: string
    }
  }
}

export interface TableBlock extends BaseBlock {
  type: 'table'
  collection_id: ID
  format: {
    collection_pointer: {
      id: ID
      table: string
      spaceId: ID
    }
    table_block_column_format?: {
      [column: string]: { width?: number; color?: Color }
    }
    table_block_column_header: boolean
    table_block_row_header: boolean
    table_block_column_order: string[]
  }
  view_ids: ID[]
}

export interface TableRowBlock extends BaseBlock {
  type: 'table_row'
  properties: {
    [column: string]: Decoration[]
  }
}

export interface ExternalObjectInstance extends BaseBlock {
  type: 'external_object_instance'
  format: {
    domain: string
    original_url: string
  }
}

export interface BreadcrumbInstance extends BaseBlock {
  type: 'breadcrumb'
}
