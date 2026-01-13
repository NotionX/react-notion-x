# Page Properties Support

This document describes the page properties support added to `notion-compat`.

## Overview

The Notion API provides comprehensive page property data through the `pages.retrieve()` endpoint. This implementation now converts all page properties from the official Notion API format to the unofficial API format compatible with `react-notion-x`.

## What's Now Supported

### 1. **All Database Page Properties**

When a page is part of a database (parent type is `database_id`), all custom properties are now converted:

- **Title** - Page title with rich text formatting
- **Rich Text** - Multi-line text with formatting
- **Number** - Numeric values
- **Select** - Single select options
- **Multi-select** - Multiple select options
- **Status** - Status property values
- **Date** - Date and date ranges
- **Checkbox** - Boolean values
- **URL** - Web links
- **Email** - Email addresses
- **Phone Number** - Phone numbers
- **People** - User references
- **Files** - File attachments
- **Relation** - Relations to other database entries
- **Formula** - Computed formula results (string, number, boolean, date)
- **Rollup** - Aggregated values from relations (number, date, array)
- **Created Time** - Page creation timestamp
- **Created By** - User who created the page
- **Last Edited Time** - Last edit timestamp
- **Last Edited By** - User who last edited
- **Unique ID** - Auto-generated unique identifiers
- **Verification** - Verification status

### 2. **Page Format Properties**

Visual and formatting properties:

- **Cover Image** (`page_cover`) - Cover image URL (external or uploaded)
- **Cover Position** (`page_cover_position`) - Vertical position (defaults to 0.5)
- **Icon** (`page_icon`) - Emoji or image icon
- **Parent Table** - Correctly set based on parent type (space/block/table)

### 3. **Metadata Properties**

All pages now include:

- Created time
- Last edited time
- Created by user ID
- Last edited by user ID
- Archived status
- Parent information

## Implementation Details

### New Module: `convert-page-properties.ts`

This module handles the conversion of all Notion API property types to the unofficial API format. Each property type is handled according to its specific structure:

```typescript
export function convertPageProperties(
  properties: types.Page['properties']
): Record<string, notion.Decoration[]>
```

### Enhanced: `convert-block.ts`

The `child_page` case now:

1. Converts all page properties using `convertPageProperties()`
2. Merges converted properties with existing properties
3. Handles cover images with proper positioning
4. Handles icons (emoji, external, file)
5. Sets correct parent table type
6. Falls back to `child_page.title` if page properties unavailable

## Usage Example

```typescript
import { Client } from '@notionhq/client'
import { NotionCompatAPI } from 'notion-compat'

const notion = new NotionCompatAPI(
  new Client({ auth: process.env.NOTION_TOKEN })
)

// Retrieve a page with default settings
const recordMap = await notion.getPage(pageId)

// Retrieve a page with custom format options
const recordMap = await notion.getPage(pageId, {
  fullWidth: true, // Force full-width layout
  pageFont: 'serif', // Set font: 'default' | 'serif' | 'mono'
  smallText: false // Enable/disable small text mode
})

// For database pages, all custom properties are now available
// in the block's properties object
const pageBlock = recordMap.block[pageId].value
console.log(pageBlock.properties) // All database properties converted
console.log(pageBlock.format) // Cover, icon, and other format properties
```

## Known Limitations

The official Notion API **does not expose** the following page format properties:

- `page_full_width` - Full width layout setting ✅ **Now supported via smart defaults + configuration**
- `page_font` - Font style (default/serif/mono) ✅ **Now supported via configuration**
- `page_small_text` - Small text setting ✅ **Now supported via configuration**
- `block_locked` - Lock status ❌ **Not available**
- `block_locked_by` - Who locked the page ❌ **Not available**

### Workarounds Implemented

Since the official API doesn't provide these properties, we've implemented:

1. **`page_full_width`**: Smart heuristic (database pages + pages with covers = full-width) with manual override
2. **`page_font`**: Configuration option to set globally or per-page
3. **`page_small_text`**: Configuration option to set globally or per-page

Properties marked ❌ are truly unavailable and would require the unofficial Notion API to retrieve.

## Property Value Format

All properties are converted to the `Decoration[]` format used by the unofficial API:

```typescript
// Simple text
property: [['text value']]

// Rich text with formatting
property: [['text', [['b']]]] // bold

// Multiple values (multi-select, files, etc.)
property: [['value1'], ['value2']]

// Date ranges
property: [['2024-01-01 → 2024-01-31']]
```

## Testing

To test with a database page:

1. Create a Notion database with various property types
2. Add a page to the database with values for each property
3. Retrieve the page using `NotionCompatAPI.getPage()`
4. Verify all properties are present in the result

## Next Steps

Future enhancements could include:

1. **Database Support** - Full collection/collection_view conversion
2. **Property Pagination** - Handle properties with >25 references using the property item endpoint
3. **User Information** - Fetch and map user details for people properties
4. **File Metadata** - Enhanced file property handling with metadata
