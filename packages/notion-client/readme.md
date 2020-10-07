<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# notion-client

> Robust TypeScript client for the unofficial Notion API.

[![NPM](https://img.shields.io/npm/v/notion-client.svg)](https://www.npmjs.com/package/notion-client) [![Build Status](https://travis-ci.com/NotionX/react-notion-x.svg?branch=master)](https://travis-ci.com/NotionX/react-notion-x) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Install

```bash
npm install notion-client
```

This package is compatible with server-side V8 contexts such as Node.js, Deno, and Cloudflare Workers.

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

## Docs

See the [auto-generated docs](https://github.com/NotionX/react-notion-x/blob/master/docs/notion-client.md).

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
