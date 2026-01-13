# Database/Collection Support

This document describes the database and collection support added to `notion-compat`.

## Overview

The Notion API provides database objects that contain structured data with schemas and properties. The `notion-compat` package now converts these databases to the unofficial API's collection format, enabling full database rendering in `react-notion-x`.

## What's Supported

### ✅ Database Schema Conversion

All database property types are converted to collection schemas:

- **title** - Title property
- **rich_text** - Text property
- **number** - Number property with formatting
- **select** - Single select with options
- **multi_select** - Multiple select with options
- **status** - Status property with options
- **date** - Date and date range
- **people** - Person references
- **files** - File attachments
- **checkbox** - Boolean values
- **url** - Web links
- **email** - Email addresses
- **phone_number** - Phone numbers
- **formula** - Formula expressions
- **relation** - Relations to other databases
- **rollup** - Aggregated values from relations
- **created_time** - Creation timestamp
- **created_by** - Creator user
- **last_edited_time** - Last edit timestamp
- **last_edited_by** - Last editor user

### ✅ Database Metadata

- Database title
- Database icon (emoji, external URL, or uploaded file)
- Database parent information
- Archived status
- Property visibility settings

### ✅ Collection Views

Since the official Notion API doesn't provide view information, we create default views:

- **Table view** (default)
- **Gallery view**
- **List view**
- **Board view**
- **Calendar view**

Each view is created with sensible defaults that work with `react-notion-x`.

### ✅ Child Database Blocks

Pages containing `child_database` blocks now:

- Fetch database metadata automatically
- Convert to `collection_view` blocks
- Include in the `collection` and `collection_view` maps
- Render properly in `react-notion-x`
- Automatically fetch database entries (up to 100 per database)

## API Usage

### Retrieve Page with Databases (Automatic - Recommended)

**By default**, `getPage()` automatically fetches database entries and includes everything in one call:

```typescript
import { Client } from '@notionhq/client'
import { NotionCompatAPI } from 'notion-compat'

const notion = new NotionCompatAPI(
  new Client({ auth: process.env.NOTION_TOKEN })
)

// Get page - databases AND their entries are automatically included
const recordMap = await notion.getPage(pageId)

// Everything is in the recordMap - no additional calls needed!
console.log(recordMap.collection) // All databases
console.log(recordMap.collection_view) // Default views
console.log(recordMap.collection_query) // Database entries (up to 100 per database)
console.log(recordMap.block) // All blocks including database pages
```

### Configure Database Entry Fetching

```typescript
// Fetch more entries per database
const recordMap = await notion.getPage(pageId, {
  fetchDatabaseEntries: true, // default: true
  maxDatabaseEntries: 500 // default: 100
})

// Disable automatic fetching (faster, but databases will be empty)
const recordMap = await notion.getPage(pageId, {
  fetchDatabaseEntries: false
})
```

### Manual Database Operations (Advanced)

For advanced use cases, you can still query databases manually:

```typescript
// Get database metadata only
const { collection, collectionView } = await notion.getDatabase(databaseId)

// Query with custom filters and sorts
const results = await notion.queryDatabase(databaseId, {
  filter: {
    property: 'Status',
    select: { equals: 'In Progress' }
  },
  sorts: [{ property: 'Created', direction: 'descending' }],
  pageSize: 50
})
```

## How It Works

### 1. Database Detection

When resolving a page, the API:

- Detects `child_database` blocks
- Fetches database metadata via `databases.retrieve()`
- Stores in `databaseMap`

### 2. Schema Conversion

The `convertCollection()` function:

- Maps database properties to collection schema
- Converts property types (e.g., `rich_text` → `text`)
- Preserves options for select/multi-select properties
- Includes formula expressions

### 3. View Creation

The `createDefaultCollectionView()` function:

- Generates a unique view ID
- Creates type-specific view format
- Sets sensible defaults for rendering

### 4. Block Conversion

`child_database` blocks are converted to:

```typescript
{
  type: 'collection_view',
  collection_id: databaseId,
  view_ids: [`${databaseId}-default-view`]
}
```

### 5. RecordMap Assembly

The final `ExtendedRecordMap` includes:

```typescript
{
  block: { /* all blocks */ },
  collection: { /* all databases */ },
  collection_view: { /* default views */ },
  collection_query: {},
  signed_urls: {},
  notion_user: {}
}
```

## Limitations

### Official API Constraints

The official Notion API doesn't provide:

1. **Custom Views** - No access to user-created views (table, gallery, board, etc.)
   - **Workaround**: We create default table views
2. **View Configuration** - No column widths, sorts, filters, or groupings
   - **Workaround**: Basic view structure with empty configurations
3. **Collection Queries** - No pre-computed query results
   - **Workaround**: Use `queryDatabase()` to fetch entries separately

4. **Inline vs Full-Page** - Limited `is_inline` detection
   - **Workaround**: Inferred from parent type

### What This Means

- Database pages render correctly with default table views
- Custom view configurations (column order, filters, sorts) are not preserved
- You need to query databases separately to get their entries
- Gallery/board/calendar views use default settings

## Example: Complete Database Page

```typescript
import { Client } from '@notionhq/client'
import { NotionCompatAPI } from 'notion-compat'

const notion = new NotionCompatAPI(
  new Client({ auth: process.env.NOTION_TOKEN })
)

// Get a page containing a database - everything included automatically!
const recordMap = await notion.getPage(pageId)

// Access the database
const databaseId = Object.keys(recordMap.collection)[0]
const collection = recordMap.collection[databaseId].value
const collectionView =
  recordMap.collection_view[`${databaseId}-default-view`].value

console.log('Database:', collection.name)
console.log('Schema:', collection.schema)
console.log('View Type:', collectionView.type)

// Database entries are already in collection_query!
const queryResult = recordMap.collection_query[databaseId][collectionView.id]
console.log('Entries:', queryResult.blockIds.length)
console.log('Entry IDs:', queryResult.blockIds)

// Entry pages are in the block map
queryResult.blockIds.forEach((entryId) => {
  const entry = recordMap.block[entryId]?.value
  if (entry) {
    console.log('Entry:', entry.properties)
  }
})
```

## Testing

To test database support:

1. Create a Notion database with various property types
2. Add some entries to the database
3. Embed the database in a page (inline or full-page)
4. Retrieve the page using `NotionCompatAPI.getPage()`
5. Verify the `collection` and `collection_view` maps are populated
6. Render with `react-notion-x`

## Future Enhancements

Potential improvements:

1. **View Detection** - Attempt to infer view types from database structure
2. **Query Integration** - Automatically fetch and include database entries
3. **Collection Query Results** - Pre-populate `collection_query` map
4. **Rollup Formulas** - Better handling of complex rollup types
5. **Relation Properties** - Fetch related database schemas

## Related Documentation

- [Page Properties Support](./PAGE_PROPERTIES_SUPPORT.md)
- [Notion API Database Reference](https://developers.notion.com/reference/database)
- [Notion API Query Database](https://developers.notion.com/reference/post-database-query)
