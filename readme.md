<p align="center">
  <img alt="Notion + TypeScript" src="https://raw.githubusercontent.com/saasify-sh/notion/master/notion-ts.png" width="689">
</p>

# notion

> TypeScript packages for [Notion's](https://notion.so) unofficial API, data types, and related utilities.

[![NPM](https://img.shields.io/npm/v/notion-client.svg)](https://www.npmjs.com/package/notion-client) [![Build Status](https://travis-ci.com/saasify-sh/notion.svg?branch=master)](https://travis-ci.com/saasify-sh/notion) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

The goal of this project is to support **100% of Notion's public, readonly functionality** as faithfully as possible in order to unlock Notion's potential as a next-generation headless CMS.

## Features

🚀 **Simple** - It's all TypeScript. Easy peasy.

⚡ **Fast** - Concurrent network IO for fetching all resources on a page.

💯 **Tests** - Comes with a comprehensive [test suite](https://www.notion.so/saasifysh/Notion-Test-Suite-067dd719a912471ea9a3ac10710e7fdf) covering 98% of Notion functionality.

📓 **Docs** - Auto-generated [docs](./docs/index.md) for all packages.

🔥 **Solid** - Used in production by Notion X (_coming soon_), [Notion VIP](https://www.notion.vip), and [Notion2Site](http://notion2site.com).

## Usage

```ts
import { NotionAPI } from 'notion-client'

// you can optionally pass an authToken to access private notion resources
const api = new NotionAPI()

// fetch a page's content, including all async blocks, collection queries, and signed urls
const page = await api.getPage('067dd719-a912-471e-a9a3-ac10710e7fdf')

// fetch the data for a specific collection instance
const collectionId = '2d8aec23-8281-4a94-9090-caaf823dd21a'
const collectionViewId = 'ab639a5a-853e-45e1-9ef7-133b486c0acf'
const colectionData = await api.getCollectionData(
  collectionId,
  collectionViewId
)
```

All examples use this public [notion workspace](https://www.notion.so/Notion-Tests-067dd719a912471ea9a3ac10710e7fdf).

## Docs

| Package                                   | NPM                                                                                                   | Docs                            | Description                                             |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------- |
| [notion-client](./packages/notion-client) | [![NPM](https://img.shields.io/npm/v/notion-client.svg)](https://www.npmjs.com/package/notion-client) | [docs](./docs/notion-client.md) | Robust TypeScript client for the unofficial Notion API. |
| [notion-types](./packages/notion-types)   | [![NPM](https://img.shields.io/npm/v/notion-types.svg)](https://www.npmjs.com/package/notion-types)   | [docs](./docs/notion-types.md)  | TypeScript types for core Notion data structures.       |
| [notion-utils](./packages/notion-utils)   | [![NPM](https://img.shields.io/npm/v/notion-utils.svg)](https://www.npmjs.com/package/notion-utils)   | [docs](./docs/notion-utils.md)  | Useful utilities for working with Notion data.          |

## Supported Blocks

The majority of Notion blocks and collection views are fully supported.

| Block Type                  | Supported  | Block Type             | Notes                                                                                                            |
| --------------------------- | ---------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Page                        | ✅ Yes     | `page`                 |
| Text                        | ✅ Yes     | `text`                 | Includes all known text formatting options                                                                       |
| Bookmark                    | ✅ Yes     | `bookmark`             | Embedded preview of external URL                                                                                 |
| Bulleted List               | ✅ Yes     | `bulleted_list`        | `<ul>`                                                                                                           |
| Numbered List               | ✅ Yes     | `numbered_list`        | `<ol>`                                                                                                           |
| Heading 1                   | ✅ Yes     | `header`               | `<h1>`                                                                                                           |
| Heading 2                   | ✅ Yes     | `sub_header`           | `<h2>`                                                                                                           |
| Heading 3                   | ✅ Yes     | `sub_sub_header`       | `<h3>`                                                                                                           |
| Quote                       | ✅ Yes     | `quote`                |
| Callout                     | ✅ Yes     | `callout`              |
| Equation (block)            | ✅ Yes     | `equation`             | [katex](https://katex.org/) via [react-katex](https://github.com/MatejBransky/react-katex)                       |
| Equation (inline)           | ✅ Yes     | `text`                 | [katex](https://katex.org/) via [react-katex](https://github.com/MatejBransky/react-katex)                       |
| Todos (checkboxes)          | ✅ Yes     | `to_do`                |
| Table Of Contents           | ✅ Yes     | `table_of_contents`    | See `notion-utils` `get                                                                                          |
| Divider                     | ✅ Yes     | `divider`              | Horizontal line                                                                                                  |
| Column                      | ✅ Yes     | `column`               |
| Column List                 | ✅ Yes     | `column_list`          |
| Toggle                      | ✅ Yes     | `toggle`               | [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)                                 |
| Image                       | ✅ Yes     | `image`                | `<img>`                                                                                                          |
| Embed                       | ✅ Yes     | `embed`                | Generic `iframe` embeds                                                                                          |
| Video                       | ✅ Yes     | `video`                | `iframe`                                                                                                         |
| Figma                       | ✅ Yes     | `figma`                | `iframe`                                                                                                         |
| Google Maps                 | ✅ Yes     | `maps`                 | `iframe`                                                                                                         |
| Google Drive                | ✅ Yes     | `drive`                | Google Docs, Sheets, etc custom embed                                                                            |
| Tweet                       | ✅ Yes     | `tweet`                | Uses the twitter embedding SDK                                                                                   |
| PDF                         | ✅ Yes     | `pdf`                  | Uses S3 signed URLs and [react-pdf](https://github.com/wojtekmaj/react-pdf)                                      |
| Audio                       | ✅ Yes     | `audio`                | Uses S3 signed URLs and [HTML5 `audio` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) |
| File                        | ✅ Yes     | `file`                 | Uses S3 signed URLs (generic downloadable file)                                                                  |
| Link                        | ✅ Yes     | `text`                 | External links                                                                                                   |
| Page Link                   | ✅ Yes     | `page`                 | Link to a notion page in the same workspace                                                                      |
| External Page Link          | ✅ Yes     | `text`                 | Links to a notion page or collection view in another workspace                                                   |
| Code (block)                | ✅ Yes     | `code`                 | Block code syntax highlighting via [prismjs](https://prismjs.com/)                                               |
| Code (inline)               | ✅ Yes     | `text`                 | Inline code formatting (no syntax highlighting)                                                                  |
| Collections                 | ✅ Yes     |                        | Also known as [databases](https://www.notion.so/Intro-to-databases-fd8cd2d212f74c50954c11086d85997e)             |
| Collections View            | ✅ Yes     | `collection_view`      | Collections have a 1:N mapping to collection views                                                               |
| Collections View (Table)    | ✅ Yes     | `collection_view`      | `type = "table"` (default table view)                                                                            |
| Collections View (Gallery)  | ✅ Yes     | `collection_view`      | `type = "gallery"` (grid view)                                                                                   |
| Collections View (Board)    | ✅ Yes     | `collection_view`      | `type = "board"` (kanban view)                                                                                   |
| Collections View (List)     | ✅ Yes     | `collection_view`      | `type = "list"` (vertical list view)                                                                             |
| Collections View (Calendar) | ❌ Missing | `collection_view`      | `type = "calendar"` (embedded calendar view)                                                                     |
| Collections View Page       | ❌ Missing | `collection_view_page` | Collection view as a standalone page                                                                             |

Please let us know if you find any issues or missing blocks.

All known blocks and most known configuration settings can be found in our [test suite](https://www.notion.so/saasifysh/Notion-Test-Suite-067dd719a912471ea9a3ac10710e7fdf).

## Related

- [notion test suite](https://www.notion.so/saasifysh/Notion-Tests-067dd719a912471ea9a3ac10710e7fdf) - Comprehensive suite of public Notion pages to test individual features.
- [react-notion](https://github.com/splitbee/react-notion) - React renderer for Notion data.
- [notion-api-worker](https://github.com/splitbee/notion-api-worker) - Notion API proxy exposed as a Cloudflare Worker.
  - This provided a solid starting point for `notion-types` and `notion-client`.
  - Currently doesn't handle collection data very robustly.
  - One of the main use cases for `react-notion` is server-side rendering via Next.js, in which case wrapping the Notion API via a CF worker is completely unnecessary.
- [notion-api-agent](https://github.com/dragonman225/notionapi-agent) - Alternative Notion API client.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>

This project extends MIT-licensed work by [Timo Lins](https://twitter.com/timolins), [Tobias Lins](https://twitter.com/linstobias), [Sam Wight](https://samw.dev), and other contributors.
