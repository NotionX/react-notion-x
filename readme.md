<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# React Notion X

> Fast and accurate React renderer for Notion. TS batteries included. ⚡️

[![NPM](https://img.shields.io/npm/v/react-notion-x.svg)](https://www.npmjs.com/package/react-notion-x) [![Build Status](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml/badge.svg)](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io) [![NPM](https://badgen.net/bundlephobia/minzip/react-notion-x)](https://bundlephobia.com/package/react-notion-x)

## Contents

- [React Notion X](#react-notion-x)
  - [Contents](#contents)
  - [Advice](#advice)
  - [Features](#features)
  - [Usage](#usage)
  - [Styles](#styles)
  - [Optional Components](#optional-components)
  - [Private Pages](#private-pages)
  - [Next.js Examples](#nextjs-examples)
  - [Packages](#packages)
  - [Supported Blocks](#supported-blocks)
  - [Performance](#performance)
  - [Related](#related)
  - [Contributing](#contributing)
  - [License](#license)
  - [Sponsor](#sponsor)

## Advice

If you just want to publish a website using Notion, then we highly recommend using [Super.so](https://s.super.so/x) — a hosted solution with great perf that takes care of all the details for you.

If you want more control over your website via React, then we recommend checking out the accompanying [Next.js starter kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit), which is free and uses `react-notion-x` under the hood.

And if you want even more control, then you're in the right place! 👇👇

## Features

- 🚀 **Simple** - TypeScript + React
- ⚡ **Fast** - 10-100x faster than Notion
  - 95-100% Lighthouse scores
  - Heavier components can be loaded lazily via `next/dynamic`
- 💯 **Tests** - Comes with a comprehensive [test suite](https://www.notion.so/Notion-Test-Suite-067dd719a912471ea9a3ac10710e7fdf) covering most of Notion's functionality
- 🔥 **Solid** - Used in production by [Potion](https://www.potion.so) and thousands of websites
- 💪 **Smooth** - Supports `next/image` along with LQIP preview images ([demo](https://react-notion-x-demo.transitivebullsh.it/3492bd6dbaf44fe7a5cac62c5d402f06))
- Framework agnostic - Use with next.js, create-react-app, gatsby, etc

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

Note: for heavier blocks, you'll have to opt into using them via `NotionRenderer.components`. These are not included in the default `NotionRenderer` export because they're too heavyweight for many use cases.

## Styles

You'll need to import some CSS styles as well. If you're using Next.js, we recommend you place these imports at the top of `pages/_app.js`:

```ts
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'

// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
```

## Optional Components

The default imports from `react-notion-x` strive to be as lightweight as possible. Most blocks will render just fine, but some larger blocks like PDFs and collection views (database views) are not included by default.

To use them, you'll need to import the ones you want from `react-notion-x/build/third-party/*`:

```tsx
import { Code } from 'react-notion-x/build/third-party/code'
import { Collection } from 'react-notion-x/build/third-party/collection'
import { Equation } from 'react-notion-x/build/third-party/equation'
import { Modal } from 'react-notion-x/build/third-party/modal'
import { Pdf } from 'react-notion-x/build/third-party/pdf'
```

Note that we strongly recommend lazy-loading these components unless you know you'll need them up front for your use case.

If you're using Next.js, you can use [next/dynamic](https://nextjs.org/docs/advanced-features/dynamic-import) to lazily load them. If your notion content doesn't use one of these heavyweight components, then it won't get loaded into your page. This keeps the initial page bundle small and your website feeling snappy.

```tsx
import dynamic from 'next/dynamic'

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  {
    ssr: false
  }
)
```

You'll need to enable them by passing them to the `components` prop of `NotionRenderer`.

```tsx
export default ({ recordMap }) => (
  <NotionRenderer
    recordMap={recordMap}
    components={{
      Code,
      Collection,
      Equation,
      Modal,
      Pdf
    }}
  />
)
```

The `Code` component uses [Prism](https://prismjs.com) under the hood. It comes bundled with support for JavaScript, TypeScript, and CSS by default. To add support for additional language syntaxes, follow the example in [`components/NotionPage.tsx`](./examples/full/components/NotionPage.tsx) which lazily loads Prism components at runtime. You will likely want to add `prismjs` to your project as a dependency when using the `Code` component so TypeScript doesn't complain.

For `Equation` support, you'll need to import the katex CSS styles.

For each of these optional components, make sure you're also importing the relevant third-party CSS if needed ([above](#Styles)).

## Private Pages

You may optionally pass an `authToken` and `activeUser` to the API if you want to access private Notion pages. Both can be retrieved from your web browser. Once you are viewing your workpace, open your Development Tools > Application > Cookie > and Copy the `token_v2` and `notion_user_id`. Respectively, activeUser: notion_user_id, authToken: token_v2.

We recommend storing these as environment variables and passing them into the `NotionAPI` constructor as follows:

```tsx
const notion = new NotionAPI({
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_TOKEN_V2
})
```

Note that this is not the same as the API token provided by the official Notion API since `notion-client` uses the unofficial Notion API (which is what all Notion apps use).

## Next.js Examples

Here's a [minimal Next.js example project](./examples/minimal) with the most important code in [`pages/[pageId].tsx`](./examples/minimal/pages/%5BpageId%5D.tsx) and [`components/NotionPage.tsx`](./examples/minimal/components/NotionPage.tsx). You can view this example [live on Vercel](https://react-notion-x-minimal-demo.transitivebullsh.it).

Here's a more [full-featured Next.js example project](./examples/full) with the most important code in [`pages/[pageId].tsx`](./examples/full/pages/%5BpageId%5D.tsx) and [`components/NotionPage.tsx`](./examples/full/components/NotionPage.tsx). You can view this example [live on Vercel](https://react-notion-x-demo.transitivebullsh.it).

The full-featured demo adds a few nice features:

- Uses [next/image](https://nextjs.org/docs/api-reference/next/image) to serve optimal images
- Uses preview images generated via [lqip-modern](https://github.com/transitive-bullshit/lqip-modern)
- Lazily bundles larger optional components via [next/dynamic](https://nextjs.org/docs/advanced-features/dynamic-import)
  - Code
  - Equation
  - Pdf
  - Modal
  - Collection (e.g., notion databases including table and gallery views)

For a production example, check out the [Next.js Notion Starter Kit](https://github.com/transitive-bullshit/nextjs-notion-starter-kit), which uses `react-notion-x` under the hood.

## Packages

| Package                                     | NPM                                                                                                     | Environment   | Description                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------- |
| [react-notion-x](./packages/react-notion-x) | [![NPM](https://img.shields.io/npm/v/react-notion-x.svg)](https://www.npmjs.com/package/react-notion-x) | Browser + SSR | Fast React renderer for Notion.                |
| [notion-client](./packages/notion-client)   | [![NPM](https://img.shields.io/npm/v/notion-client.svg)](https://www.npmjs.com/package/notion-client)   | Server-side\* | Robust TypeScript client for the Notion API.   |
| [notion-types](./packages/notion-types)     | [![NPM](https://img.shields.io/npm/v/notion-types.svg)](https://www.npmjs.com/package/notion-types)     | Universal     | Core Notion TypeScript types.                  |
| [notion-utils](./packages/notion-utils)     | [![NPM](https://img.shields.io/npm/v/notion-utils.svg)](https://www.npmjs.com/package/notion-utils)     | Universal     | Useful utilities for working with Notion data. |

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

<p align="center">
  <img alt="Google Lighthouse Scores" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/react-notion-x-perf.png" width="600" />
  <br>
  <i>Google Lighthouse scores for an <a href="https://react-notion-x-demo.transitivebullsh.it/38fa73d49b8f40aab1f3f8c82332e518">example page</a> rendered by `react-notion-x` on Vercel.</i>
  <br>
  <br>
  <a href="https://bundlephobia.com/package/react-notion-x" title="Bundlephobia">
    <img alt="Bundlephobia" src="https://badgen.net/bundlephobia/minzip/react-notion-x" />
  </a>
</p>

Out of the box, `react-notion-x` is pretty fast and relatively lightweight, but there are a few key factors to be aware of.

Bundlephobia reports a [~28kb gzip bundle size](https://bundlephobia.com/result?p=react-notion-x) for the main `react-notion-x` bundle. This doesn't include the optional `third-party` components which we recommend lazy loading via [next/dynamic](https://nextjs.org/docs/advanced-features/dynamic-import) only if a page needs them.

Another major factor for perf comes from images hosted by Notion. They're generally unoptimized, improperly sized, and not cacheable because Notion has to deal with fine-grained access control that users can change at any time. You can override the default `mapImageUrl` function on `NotionRenderer` to add caching via a CDN like Cloudflare Workers, which is what Notion X does for optimal page load speeds.

`NotionRenderer` also supports lazy image loading with optional low quality image placeholder previews. You can see a demo of this in practice [on this page](https://react-notion-x-demo.transitivebullsh.it/3492bd6dbaf44fe7a5cac62c5d402f06) which is using [lqip-modern](https://github.com/transitive-bullshit/lqip-modern) to pre-generate placeholder images that are inspired by Medium.com's image loading.

If you're using Next.js, we recommend passing `next/image` or `next/legacy/image`, and `next/link` to the renderer as follows:

```tsx
import Image from 'next/image' // or import Image from 'next/legacy/image' if you use legacy Image
import Link from 'next/link'

export default ({ recordMap }) => (
  <NotionRenderer
    recordMap={recordMap}
    components={{
      nextImage: Image, // or nextLegacyImage: LegacyImage,
      nextLink: Link
    }}
  />
)
```

This wraps these next.js components in a compatability layer so `NotionRenderer` can use them the same as their non-next.js equivalents `<img>` and `<a>`.

Note that custom image component is currently only enabled with preview image or by turning on `forceCustomImages` of `NotionRenderer`.

## Related

- [Next.js Template](https://github.com/transitive-bullshit/nextjs-notion-starter-kit) - The easiest way to deploy a self-hosted Notion site with Next.js and Vercel.
  - Only takes a few minutes to setup!
  - Uses `react-notion-x` under the hood
- [Notion Test Suite](https://www.notion.so/Notion-Test-Suite-067dd719a912471ea9a3ac10710e7fdf) - Comprehensive suite of Notion test pages
- [react-notion](https://github.com/splitbee/react-notion) - Original react renderer for notion
  - `react-notion-x` started as a fork of `react-notion` with better support for different types of Notion content (especially collections) and grew into something much more comprehensive
  - `react-notion` is no longer actively maintained
- [notion-api-worker](https://github.com/splitbee/notion-api-worker) - Notion API proxy exposed as a Cloudflare Worker
  - `notion-types` and `notion-client` are a rewrite of `notion-api-worker`
  - One of the main use cases for `react-notion-x` is server-side rendering via Next.js, in which case the CF worker is unnecessary
  - We recommend that you use [notion-client](./packages/notion-client) instead
- [notion-py](https://github.com/jamalex/notion-py) - Python wrapper around the Notion API

## Contributing

See the [contribution guide](contributing.md) and join our amazing list of [contributors](https://github.com/transitive-bullshit/nextjs-notion-starter-kit/graphs/contributors)!

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

This project extends MIT-licensed work by [Timo Lins](https://twitter.com/timolins), [Tobias Lins](https://twitter.com/linstobias), [Sam Wight](https://samw.dev), and other contributors.

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>

## Sponsor

[Super.so](https://s.super.so/x) has been kind enough to sponsor this project. If you're looking for a hosted solution that takes a very similar approach to `react-notion-x` but handles all of the details for you, then definitely check them out.

<p align="center">
  <a href="https://s.super.so/x" title="Super.so">
    <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/super-so-banner.png">
  </a>
</p>
