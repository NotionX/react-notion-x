<p align="center">
  <img alt="Notion + TypeScript" src="https://raw.githubusercontent.com/notion-x/notion-kit/master/notion-ts.png" width="689">
</p>

# notion-utils

> Useful utilities for working with Notion data. Isomorphic.

[![NPM](https://img.shields.io/npm/v/notion-utils.svg)](https://www.npmjs.com/package/notion-utils) [![Build Status](https://travis-ci.com/notion-x/notion-kit.svg?branch=master)](https://travis-ci.com/notion-x/notion-kit) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Install

```bash
npm install notion-utils
```

This package is compatible with both Node.js and client-side web usage.

## Usage

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

## Docs

See the [auto-generated docs](https://github.com/notion-x/notion-kit/blob/master/docs/notion-utils.md).

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
