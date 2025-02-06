<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# notion-utils

> Useful utilities for working with Notion data. Isomorphic.

[![NPM](https://img.shields.io/npm/v/notion-utils.svg)](https://www.npmjs.com/package/notion-utils) [![Build Status](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml/badge.svg)](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Install

```bash
npm install notion-utils
```

This package is compatible with both Node.js and client-side web usage.

## Usage

### parsePageId

URLs for Notion pages follow this pattern: `https://www.notion.so/{title}-{id}`.

This function extracts a Notion page's id from its url so that it can be used to query the page's properties and children block.

```ts
import { parsePageId } from 'notion-utils'

parsePageId(
  'https://www.notion.so/Notion-Tests-067dd719a912471ea9a3ac10710e7fdf'
)
// '067dd719-a912-471e-a9a3-ac10710e7fdf'

parsePageId('About-d9ae0c6e7cad49a78e21d240cf2e3d04')
// 'd9ae0c6e-7cad-49a7-8e21-d240cf2e3d04'

parsePageId('About-d9ae0c6e7cad49a78e21d240cf2e3d04', { uuid: false })
// 'd9ae0c6e7cad49a78e21d240cf2e3d04'
```

### getCanonicalPageId

This function returns a display-friendly id for a page that follows this pattern: `{page title}-{page id}`. It is useful for programmatically creating  pretty urls, aka slugs for Notion pages.

The function takes three parameters:
- `pageId`
- `recordMap`: The response from querying the current page, or its parent page using `getPage` method of `notion-client`. Under the hood, the function uses the `pageId` as a key to look up its properties.
- `uuid`: boolean (optional): Whether the returned slug should contain id or not. Default to true.

```
ts
import { getCanonicalPageId } from 'notion-utils'
import { NotionAPI } from 'notion-client'

const notion = new NotionAPI()

const databaseId = '3e3073e97aee481cb831765e112ec7b5'
const childPageId = '27aaa1b503fb44e9a0d842a9e8f39325'

const database = notion.getPage(databaseId)

const childPageSlug1 = getCanonicalPageId(childPageId, database)
// log 'next-js-notion-starter-kit-27aaa1b503fb44e9a0d842a9e8f39325'

const childPageSlug2 = getCanonicalPageId(childPageId, database, { uuid: false })
// log 'nextjs-notion-starter-kit'
```


## Docs

See the [full docs](https://github.com/NotionX/react-notion-x).

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
