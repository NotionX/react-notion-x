<p align="center">
  <img alt="React Notion Kit" src="https://raw.githubusercontent.com/NotionX/notion-kit/master/notion-ts.png" width="689">
</p>

# React Notion X

> Fast and accurate React renderer for Notion. TS batteries included. ⚡️

[![NPM](https://img.shields.io/npm/v/notion-client.svg)](https://www.npmjs.com/package/notion-client) [![Build Status](https://travis-ci.com/NotionX/notion-kit.svg?branch=master)](https://travis-ci.com/NotionX/notion-kit) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Features

- 🚀 **Simple** - TypeScript + React. Easy peasy.
- ⚡ **Fast** - Concurrent network IO for fetching all resources on a page.
- 😻 **Lightweight** - ~95% lighthouse performance scores.
  - 10-100x faster than Notion.
  - Heavier components like PDFs and collection views are loaded lazily via `next/dynamic`.
- 💯 **Tests** - Comes with a comprehensive [test suite](https://www.notion.so/Notion-Test-Suite-067dd719a912471ea9a3ac10710e7fdf) covering most of Notion's functionality.
- 🔥 **Solid** - Used in production by Notion X (_coming soon_), [Notion VIP](https://www.notion.vip), and [Notion2Site](http://notion2site.com).

This project has been built with the expectation that once Notion's official API launches, it will only take minor changes to support.

## Usage

First you'll want to fetch the content for a Notion page:

```ts
import { NotionAPI } from 'notion-client'

const api = new NotionAPI()

// fetch the page's content, including all async blocks, collection queries, and signed urls
const recordMap = await api.getPage('067dd719a912471ea9a3ac10710e7fdf')
```

Once you have the data for a Notion page, you can render it:

```tsx
import React from 'react'
import { NotionRenderer } from 'react-notion-x'

export default ExampleNotionPage({ recordMap }) => (
  <NotionRenderer
    recordMap={recordMap}
    fullPage={true}
    darkMode={false}
  />
)
```

You may optionally pass an `authToken` to the API if you want to access private Notion resources.

## Next.js Example

Here's a full [Next.js example project](https://github.com/NotionX/react-notion-x/tree/master/example) with the most important code in [`pages/[pageId]`.tsx](https://github.com/NotionX/react-notion-x/blob/master/example/pages/%5BpageId%5D.tsx).

You can check out this [example hosted live on Vercel](https://react-demo.notionx.so).

If you're interested in a more optimized service built around `react-notion-x`, check out the equivalent [Notion X Demo](https://demo.notionx.so).

## Packages

| Package                                     | NPM                                                                                                     | Docs                              | Environment   | Description                                             |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------- | ------------------------------------------------------- |
| [react-notion-x](./packages/react-notion-x) | [![NPM](https://img.shields.io/npm/v/react-notion-x.svg)](https://www.npmjs.com/package/react-notion-x) | [docs](./packages/react-notion-x) | Browser + SSR | Fast and accurate React renderer for Notion.            |
| [notion-client](./packages/notion-client)   | [![NPM](https://img.shields.io/npm/v/notion-client.svg)](https://www.npmjs.com/package/notion-client)   | [docs](./docs/notion-client.md)   | Server-side\* | Robust TypeScript client for the unofficial Notion API. |
| [notion-types](./packages/notion-types)     | [![NPM](https://img.shields.io/npm/v/notion-types.svg)](https://www.npmjs.com/package/notion-types)     | [docs](./docs/notion-types.md)    | Universal     | TypeScript types for core Notion data structures.       |
| [notion-utils](./packages/notion-utils)     | [![NPM](https://img.shields.io/npm/v/notion-utils.svg)](https://www.npmjs.com/package/notion-utils)     | [docs](./docs/notion-utils.md)    | Universal     | Useful utilities for working with Notion data.          |

\* Notion's API should not be called from client-side browsers due to CORS restrictions. `notion-client` is compatible with Node.js, Deno, and Cloudflare Workers.

## Supported Blocks

The majority of Notion blocks and collection views are fully supported.

| Block Type               | Supported  | Block Type Enum        | Notes                                                                                                            |
| ------------------------ | ---------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Page                     | ✅ Yes     | `page`                 |
| Text                     | ✅ Yes     | `text`                 | Supports all known text formatting options                                                                       |
| Bookmark                 | ✅ Yes     | `bookmark`             | Embedded preview of external URL                                                                                 |
| Bulleted List            | ✅ Yes     | `bulleted_list`        | `<ul>`                                                                                                           |
| Numbered List            | ✅ Yes     | `numbered_list`        | `<ol>`                                                                                                           |
| Heading 1                | ✅ Yes     | `header`               | `<h1>`                                                                                                           |
| Heading 2                | ✅ Yes     | `sub_header`           | `<h2>`                                                                                                           |
| Heading 3                | ✅ Yes     | `sub_sub_header`       | `<h3>`                                                                                                           |
| Quote                    | ✅ Yes     | `quote`                |
| Callout                  | ✅ Yes     | `callout`              |
| Equation (block)         | ✅ Yes     | `equation`             | [katex](https://katex.org/) via [react-katex](https://github.com/MatejBransky/react-katex)                       |
| Equation (inline)        | ✅ Yes     | `text`                 | [katex](https://katex.org/) via [react-katex](https://github.com/MatejBransky/react-katex)                       |
| Todos (checkboxes)       | ✅ Yes     | `to_do`                |
| Table Of Contents        | ✅ Yes     | `table_of_contents`    | See `notion-utils` `get                                                                                          |
| Divider                  | ✅ Yes     | `divider`              | Horizontal line                                                                                                  |
| Column                   | ✅ Yes     | `column`               |
| Column List              | ✅ Yes     | `column_list`          |
| Toggle                   | ✅ Yes     | `toggle`               | [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)                                 |
| Image                    | ✅ Yes     | `image`                | `<img>`                                                                                                          |
| Embed                    | ✅ Yes     | `embed`                | Generic `iframe` embeds                                                                                          |
| Video                    | ✅ Yes     | `video`                | `iframe`                                                                                                         |
| Figma                    | ✅ Yes     | `figma`                | `iframe`                                                                                                         |
| Google Maps              | ✅ Yes     | `maps`                 | `iframe`                                                                                                         |
| Google Drive             | ✅ Yes     | `drive`                | Google Docs, Sheets, etc custom embed                                                                            |
| Tweet                    | ✅ Yes     | `tweet`                | Uses the twitter embedding SDK                                                                                   |
| PDF                      | ✅ Yes     | `pdf`                  | Uses S3 signed URLs and [react-pdf](https://github.com/wojtekmaj/react-pdf)                                      |
| Audio                    | ✅ Yes     | `audio`                | Uses S3 signed URLs and [HTML5 `audio` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) |
| File                     | ✅ Yes     | `file`                 | Uses S3 signed URLs (generic downloadable file)                                                                  |
| Link                     | ✅ Yes     | `text`                 | External links                                                                                                   |
| Page Link                | ✅ Yes     | `page`                 | Link to a notion page in the same workspace                                                                      |
| External Page Link       | ✅ Yes     | `text`                 | Links to a notion page or collection view in another workspace                                                   |
| Code (block)             | ✅ Yes     | `code`                 | Block code syntax highlighting via [prismjs](https://prismjs.com/)                                               |
| Code (inline)            | ✅ Yes     | `text`                 | Inline code formatting (no syntax highlighting)                                                                  |
| Collections              | ✅ Yes     |                        | Also known as [databases](https://www.notion.so/Intro-to-databases-fd8cd2d212f74c50954c11086d85997e)             |
| Collection View          | ✅ Yes     | `collection_view`      | Collections have a 1:N mapping to collection views                                                               |
| Collection View Table    | ✅ Yes     | `collection_view`      | `type = "table"` (default table view)                                                                            |
| Collection View Gallery  | ✅ Yes     | `collection_view`      | `type = "gallery"` (grid view)                                                                                   |
| Collection View Board    | ✅ Yes     | `collection_view`      | `type = "board"` (kanban view)                                                                                   |
| Collection View List     | ✅ Yes     | `collection_view`      | `type = "list"` (vertical list view)                                                                             |
| Collection View Calendar | ❌ Missing | `collection_view`      | `type = "calendar"` (embedded calendar view)                                                                     |
| Collection View Page     | ✅ Yes     | `collection_view_page` | Collection view as a standalone page                                                                             |

Please let us know if you find any issues or missing blocks.

All known blocks and most known configuration settings can be found in our [test suite](https://www.notion.so/Notion-Test-Suite-067dd719a912471ea9a3ac10710e7fdf).

## Related

- [Notion Test Suite](https://www.notion.so/Notion-Test-Suite-067dd719a912471ea9a3ac10710e7fdf) - Comprehensive suite of Notion test pages
  - Includes all individual blocks
  - Includes all collection views
  - Covers most formatting options
  - More edge cases and feature coverage will be added over time
- [react-notion](https://github.com/splitbee/react-notion) - Original React renderer for Notion.
  - `react-notion-x` is a fork of `react-notion` with more comprehensive support for different types of Notion content.
  - It's my hope that the two projects will be merged together incrementally going forwards.
- [notion-api-worker](https://github.com/splitbee/notion-api-worker) - Notion API proxy exposed as a Cloudflare Worker.
  - This provided a solid starting point for `notion-types` and `notion-client`.
  - It currently doesn't handle collection data very well.
  - One of the main use cases for `react-notion` is server-side rendering via Next.js, in which case the CF worker is unnecessary.
- [notion-api-agent](https://github.com/dragonman225/notionapi-agent) - Alternative Notion API client.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>

This project extends MIT-licensed work by [Timo Lins](https://twitter.com/timolins), [Tobias Lins](https://twitter.com/linstobias), [Sam Wight](https://samw.dev), and other contributors.
