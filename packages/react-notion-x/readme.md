<p align="center">
  <img
    src="https://storage.googleapis.com/saasify-assets/notionx-social-1x.jpg"
    alt="Notion X"
  />
</p>

# React Notion X

> Extremely fast and accurate React renderer for Notion.

[![NPM](https://img.shields.io/npm/v/react-notion-x.svg)](https://www.npmjs.com/package/react-notion-x) [![Build Status](https://travis-ci.com/NotionX/notion-kit.svg?branch=master)](https://travis-ci.com/NotionX/notion-kit) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Install

```bash
npm install react-notion-x
```

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

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
