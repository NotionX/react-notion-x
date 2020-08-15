<p align="center">
  <img alt="Notion + TypeScript" src="https://raw.githubusercontent.com/saasify-sh/notion/master/notion-ts.png" width="689">
</p>

# notion-client

> TypeScript client for the unofficial Notion API.

[![NPM](https://img.shields.io/npm/v/notion-client.svg)](https://www.npmjs.com/package/notion-client) [![Build Status](https://travis-ci.com/saasify-sh/notion.svg?branch=master)](https://travis-ci.com/saasify-sh/notion) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Install

```bash
npm install notion-client
```

This package is compatible with server-side V8 contexts such as Node.js, Deno, and Cloudflare Workers.

## Usage

```ts
import { NotionAPI } from 'notion-client'

const api = new NotionAPI()

// this will fetch all blocks for the given page as well as any collection data
// for collection views contained on the page
const page = await api.getPage('067dd719-a912-471e-a9a3-ac10710e7fdf')

// example of fetching the data for a specific collection instance
const collectionId = '2d8aec23-8281-4a94-9090-caaf823dd21a'
const collectionViewId = 'ab639a5a-853e-45e1-9ef7-133b486c0acf'
const colectionData = await api.getCollectionData(
  collectionId,
  collectionViewId
)
```

## Docs

See the [auto-generated docs](https://github.com/saasify-sh/notion/blob/master/docs/notion-client.md).

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
