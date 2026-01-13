<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# notion-v1-client

> Raw TypeScript client for Notion V1 API without adaptation layer

## Features

- **Zero Adaptation**: Preserves all V1 API data exactly as returned by Notion
- **Complete Data Capture**: Fetches pages, blocks, databases, users, and relationships
- **Raw Data Storage**: No conversion or transformation - perfect for analysis
- **Concurrent Processing**: Configurable concurrency for efficient data fetching
- **Error Resilience**: Continues processing even when individual blocks fail
- **Relationship Mapping**: Tracks parent-child relationships and references

## Install

```bash
npm install notion-v1-client
```

This package requires `@notionhq/client` as a peer dependency.

## Usage

```ts
import { Client } from '@notionhq/client'
import { NotionV1API } from 'notion-v1-client'

const notion = new NotionV1API(new Client({ auth: process.env.NOTION_TOKEN }))

const rawData = await notion.getPage(pageId)
```

## Raw Data Structure

The `getPage` method returns a `V1RawPageData` object containing:

```ts
interface V1RawPageData {
  page: V1PageResponse // Root page data
  rootBlock: V1BlockResponse // Root block data
  allBlocks: Record<string, V1BlockResponse> // All blocks by ID
  allPages: Record<string, V1PageResponse> // All pages by ID
  allDatabases: Record<string, V1DatabaseResponse> // All databases by ID
  blockChildren: Record<string, string[]> // Parent-child relationships
  parentMap: Record<string, string> // Child-parent mapping
  users: Record<string, V1UserResponse> // User information
  metadata: {
    fetchedAt: string
    pageId: string
    totalBlocks: number
    totalPages: number
    totalDatabases: number
  }
}
```

## Configuration Options

```ts
const api = new NotionV1API(client, {
  concurrency: 4, // Concurrent requests (default: 4)
  maxDepth: 10, // Maximum recursion depth (default: 10)
  fetchUsers: true, // Fetch user information (default: true)
  fetchDatabases: true, // Fetch database information (default: true)
  includeMetadata: true // Include fetch metadata (default: true)
})
```

## Purpose

This package is designed for:

- **Data Analysis**: Preserve complete V1 API responses for detailed analysis
- **Migration Planning**: Understand the full structure before converting to V3 format
- **API Research**: Study Notion's V1 API responses without any modifications
- **Custom Conversion**: Build your own adaptation layer based on raw data

## Comparison with Other Packages

| Package            | API Version      | Data Modification | Use Case                              |
| ------------------ | ---------------- | ----------------- | ------------------------------------- |
| `notion-client`    | Unofficial V3    | None              | Full functionality, fast              |
| `notion-compat`    | Official V1 → V3 | Heavy conversion  | V1 API with V3 compatibility          |
| `notion-v1-client` | Official V1      | **None**          | Raw data analysis & custom conversion |

## Error Handling

The client continues processing even when individual blocks fail, storing error information:

```ts
{
  id: "block-id",
  error: {
    type: "PERMISSION_DENIED" | "NOT_FOUND" | "RATE_LIMIT" | "API_ERROR" | "UNKNOWN",
    message: "Error description",
    originalError: originalErrorObject
  }
}
```

## Next Steps

After collecting raw V1 data with this package, you can:

1. Analyze the complete data structure
2. Build custom conversion logic to V3 format
3. Create optimized adapters for specific use cases
4. Study API differences and compatibility requirements

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
