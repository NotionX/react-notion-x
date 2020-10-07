<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# React Notion X

> Fast and accurate React renderer for Notion. TS batteries included. ⚡️

[![NPM](https://img.shields.io/npm/v/notion-client.svg)](https://www.npmjs.com/package/notion-client) [![Build Status](https://travis-ci.com/NotionX/react-notion-x.svg?branch=master)](https://travis-ci.com/NotionX/react-notion-x) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Features

- 🚀 **Simple** - TypeScript + React.
- ⚡ **Fast** - 10-100x faster than Notion.
  - 95-100% Lighthouse scores.
  - Heavier components like PDFs and collection views are loaded lazily via `next/dynamic`.
- 💯 **Tests** - Comes with a comprehensive [test suite](https://www.notion.so/Notion-Test-Suite-067dd719a912471ea9a3ac10710e7fdf) covering most of Notion's functionality.
- 🔥 **Solid** - Used in production by Notion X (_coming soon_), [Notion VIP](https://www.notion.vip), and [Notion2Site](http://notion2site.com).

## Usage

First you'll want to fetch the content for a Notion page:

```ts
import { NotionAPI } from 'notion-client'

const notion = new NotionAPI()

const recordMap = await notion.getPage('067dd719a912471ea9a3ac10710e7fdf')
```

Once you have the data for a Notion page, you can render it via React:

```tsx
import React from 'react'
import { NotionRenderer } from 'react-notion-x'

export default ({ recordMap }) => (
  <NotionRenderer recordMap={recordMap} fullPage={true} darkMode={false} />
)
```

You may optionally pass an `authToken` to the API if you want to access private Notion resources.

## Styles

You'll need to import some CSS styles as well. If you're using Next.js, we recommend you place these imports at the top of `pages/_app.js`:

```ts
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'

// used for collection views (optional)
import 'rc-dropdown/assets/index.css'

// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
```

## Next.js Example

Here's a full [Next.js example project](https://github.com/NotionX/react-notion-x/tree/master/example) with the most important code in [`pages/[pageId]`.tsx](https://github.com/NotionX/react-notion-x/blob/master/example/pages/%5BpageId%5D.tsx).

You can check out this [example hosted live on Vercel](https://react-demo.notionx.so).

If you're interested in a more robust service built around `react-notion-x` that features a bunch of additional goodies and optimizations, check out the equivalent [Notion X Demo](https://demo.notionx.so).

## Packages

| Package                                     | NPM                                                                                                     | Docs                              | Environment   | Description                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------- | ---------------------------------------------- |
| [react-notion-x](./packages/react-notion-x) | [![NPM](https://img.shields.io/npm/v/react-notion-x.svg)](https://www.npmjs.com/package/react-notion-x) | [docs](./packages/react-notion-x) | Browser + SSR | Fast React renderer for Notion.                |
| [notion-client](./packages/notion-client)   | [![NPM](https://img.shields.io/npm/v/notion-client.svg)](https://www.npmjs.com/package/notion-client)   | [docs](./docs/notion-client.md)   | Server-side\* | Robust TypeScript client for the Notion API.   |
| [notion-types](./packages/notion-types)     | [![NPM](https://img.shields.io/npm/v/notion-types.svg)](https://www.npmjs.com/package/notion-types)     | [docs](./docs/notion-types.md)    | Universal     | Core Notion TypeScript types.                  |
| [notion-utils](./packages/notion-utils)     | [![NPM](https://img.shields.io/npm/v/notion-utils.svg)](https://www.npmjs.com/package/notion-utils)     | [docs](./docs/notion-utils.md)    | Universal     | Useful utilities for working with Notion data. |

\* Notion's API should not be called from client-side browsers due to CORS restrictions. `notion-client` is compatible with Node.js and Deno.

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
| Table Of Contents        | ✅ Yes     | `table_of_contents`    | See `notion-utils` `getPageTableOfContents` helper funtion                                                       |
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

## Performance

Out of the box, `react-notion-x` is pretty fast and relatively lightweight, but there are a few key factors to be aware of.

Bundlephobia reports a [~27.5kb gzip bundle size](https://bundlephobia.com/result?p=react-notion-x@0.1.0), but about 80% of this opaque bundle is loaded lazily via [next/dynamic](https://nextjs.org/docs/advanced-features/dynamic-import) for heavier features like PDF and collection support _only if a page needs them_. For most pages, the total gzip bundle size for `react-notion-x` will be ~10kb.

Another major factor for perf comes from images hosted by Notion. They're generally unoptimized, improperly sized, and not cacheable because Notion has to deal with fine-grained access control that users can change at any time. You can override the default `mapImageUrl` function on `NotionRenderer` to add caching via a CDN like Cloudflare Workers, which is what Notion X does for optimal page load speeds.

`NotionRenderer` also supports lazy image loading with optional low quality image placeholder previews. You can see a demo of this in practice [on this page](https://demo.notionx.so/image-sizing-3492bd6dbaf44fe7a5cac62c5d402f06) which is using [lqip-modern](https://github.com/transitive-bullshit/lqip-modern) to pre-generate placeholder images that are inspired by Medium.com's image loading.

<p align="center">
  <img alt="Google Lighthouse Scores" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/react-notion-x-perf.png" width="600" />
  <br>
  <i>Google Lighthouse scores for an <a href="https://demo.notionx.so/checklists-38fa73d49b8f40aab1f3f8c82332e518">example page</a> hosted by Notion X.</i>
</p>

## Related

- [Notion Test Suite](https://www.notion.so/Notion-Test-Suite-067dd719a912471ea9a3ac10710e7fdf) - Comprehensive suite of Notion test pages
  - Includes all individual blocks
  - Includes all collection views
  - Covers most formatting options
  - More edge cases and feature coverage will be added over time
- [react-notion](https://github.com/splitbee/react-notion) - Original React renderer for Notion.
  - `react-notion-x` is a fork of `react-notion` with better support for different types of Notion content (especially collection views).
  - It's my hope that the two projects will be merged together incrementally going forwards.
- [notion-api-worker](https://github.com/splitbee/notion-api-worker) - Notion API proxy exposed as a Cloudflare Worker.
  - `notion-types` and `notion-client` are a refactored fork of `notion-api-worker`.
  - One of the main use cases for `react-notion` is server-side rendering via Next.js, in which case the CF worker is unnecessary.
- [notion-api-agent](https://github.com/dragonman225/notionapi-agent) - Alternative Notion API client.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>

This project extends MIT-licensed work by [Timo Lins](https://twitter.com/timolins), [Tobias Lins](https://twitter.com/linstobias), [Sam Wight](https://samw.dev), and other contributors.
