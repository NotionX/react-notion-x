# Notion API Configuration Documentation

## Overview

This document describes the configuration changes made to switch between Notion's unofficial V3 API and official V1 API in the react-notion-x full example.

## Configuration Files

### 1. API Selection Configuration (`lib/config.ts`)

```typescript
// Switch between unofficial V3 API (false) and official V1 API (true)
export const useOfficialNotionAPI = true

// Root page configuration
export const rootNotionPageId = '28d5564d5425808c8371d4c232ac5a95'
export const rootNotionSpaceId = ''
```

**Key Changes Made:**

- Changed `useOfficialNotionAPI` from `false` to `true`
- This enables the official Notion API with compatibility layer

### 2. API Client Setup (`lib/notion.ts`)

```typescript
import { Client, LogLevel } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { NotionCompatAPI } from 'notion-compat'

const notion = useOfficialNotionAPI
  ? new NotionCompatAPI(
      new Client({
        auth: process.env.NOTION_TOKEN,
        logLevel: LogLevel.DEBUG
      })
    )
  : new NotionAPI({
      activeUser: 'a8ee6b11-07a9-4d0a-993f-c4c4590e42ff',
      authToken: 'v03:...' // V3 API token
    })
```

**Key Changes Made:**

1. **Added LogLevel import**: `import { Client, LogLevel } from '@notionhq/client'`
2. **Enabled debug logging**: Added `logLevel: LogLevel.DEBUG` to Client configuration
3. **Switched API mode**: `useOfficialNotionAPI = true` activates the official API path

## API Comparison

### Official API (V1) - Current Configuration

- **Client**: `@notionhq/client` with `NotionCompatAPI` wrapper
- **Authentication**: `NOTION_TOKEN` environment variable (official API token)
- **Logging**: Debug level enabled for detailed API call information
- **Performance**: Slower due to multiple API calls and data transformation
- **Compatibility**: ~20 blocks full support, 8 blocks partial support

### Unofficial API (V3) - Previous Configuration

- **Client**: `NotionAPI` from `notion-client`
- **Authentication**: Browser cookies (`token_v2`, `activeUser`)
- **Performance**: Faster with single API calls
- **Compatibility**: Full support for all Notion blocks and formatting

## Environment Variables Required

### For Official API (Current Setup)

```bash
NOTION_TOKEN=your_official_notion_integration_token
```

### For Unofficial API (Alternative Setup)

```bash
# Not needed when using unofficial API as tokens are hardcoded
# (Not recommended for production)
```

## Debug Logging

With `LogLevel.DEBUG` enabled, you'll see detailed logs including:

- API request/response details
- Authentication information
- Error messages and stack traces
- Performance metrics

## Switching Between APIs

To switch back to unofficial API:

1. **Update config.ts:**

```typescript
export const useOfficialNotionAPI = false
```

2. **Remove debug logging** (optional):

```typescript
const notion = useOfficialNotionAPI
  ? new NotionCompatAPI(new Client({ auth: process.env.NOTION_TOKEN }))
  : new NotionAPI({
      activeUser: 'a8ee6b11-07a9-4d0a-993f-c4c4590e42ff',
      authToken: 'your_v3_token_here'
    })
```

## Performance Considerations

### Official API (Current)

- **Pros**: Stable, officially supported, proper authentication
- **Cons**: Significantly slower, limited block support, requires data transformation

### Unofficial API (Alternative)

- **Pros**: 10-100x faster, complete block support, native data format
- **Cons**: Unofficial, potential breaking changes, complex authentication

## Troubleshooting

### Common Issues with Official API

1. **Missing blocks**: Some blocks appear as "unsupported" type
2. **Slow performance**: Multiple API calls required per page
3. **Authentication errors**: Ensure `NOTION_TOKEN` is valid integration token

### Debug Information

With debug logging enabled, check console output for:

- API endpoint calls
- Response status codes
- Data transformation steps
- Error details

## Security Notes

- **Official API**: Uses proper OAuth tokens, recommended for production
- **Unofficial API**: Uses browser cookies, requires careful token management
- **Environment Variables**: Always use environment variables for tokens, never hardcode in production

## Migration Path

Current setup uses official API with compatibility layer. This provides:

- Better long-term stability
- Proper authentication flow
- Foundation for future API improvements
- Compliance with Notion's official integration guidelines

The trade-off is reduced performance and block support compared to the unofficial V3 API.
