import type * as notion from 'notion-types'

/**
 * Creates a default collection view for a database
 * The official Notion API doesn't provide view information,
 * so we create a basic table view as default
 */
export function createDefaultCollectionView(
  databaseId: string,
  viewType: notion.CollectionViewType = 'table'
): notion.CollectionView {
  const viewId = `${databaseId}-default-view`

  const baseView: notion.BaseCollectionView = {
    id: viewId,
    type: viewType,
    name: 'Default View',
    format: {},
    version: 1,
    alive: true,
    parent_id: databaseId,
    parent_table: 'collection',
    query2: {
      group_by: '' as any
    }
  }

  // Create type-specific view
  switch (viewType) {
    case 'table':
      return {
        ...baseView,
        type: 'table',
        format: {
          table_wrap: true,
          table_properties: []
        },
        page_sort: []
      } as notion.TableCollectionView

    case 'gallery':
      return {
        ...baseView,
        type: 'gallery',
        format: {
          gallery_cover: { type: 'page_cover' },
          gallery_cover_size: 'medium',
          gallery_cover_aspect: 'cover',
          gallery_properties: []
        }
      } as notion.GalleryCollectionView

    case 'list':
      return {
        ...baseView,
        type: 'list',
        format: {
          list_properties: []
        }
      } as notion.ListCollectionView

    case 'board':
      return {
        ...baseView,
        type: 'board',
        format: {
          board_cover: { type: 'page_cover' },
          board_cover_size: 'medium',
          board_cover_aspect: 'cover',
          board_properties: [],
          board_groups2: [],
          board_columns: []
        }
      } as notion.BoardCollectionView

    case 'calendar':
      return {
        ...baseView,
        type: 'calendar',
        format: {}
      } as notion.CalendarCollectionView

    default:
      return {
        ...baseView,
        type: 'table',
        format: {
          table_wrap: true,
          table_properties: []
        },
        page_sort: []
      } as notion.TableCollectionView
  }
}
