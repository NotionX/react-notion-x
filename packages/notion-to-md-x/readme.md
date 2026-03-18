<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# notion-to-md-x

> Converts a Notion page to GitHub-Flavored Markdown. Useful for using Notion with LLMs.

[![NPM](https://img.shields.io/npm/v/notion-to-md-x.svg)](https://www.npmjs.com/package/notion-to-md-x) [![Build Status](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml/badge.svg)](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Install

```bash
npm install notion-to-md-x
```

## Usage

```ts
import { NotionAPI } from 'notion-client'
import { notionPageToMarkdown } from 'notion-to-md-x'

const api = new NotionAPI()

// fetch a page's content
const page = await api.getPage('067dd719a912471ea9a3ac10710e7fdf')

// convert the page to a markdown string
const markdown = notionPageToMarkdown(page)

console.log(markdown)
```

### Notes

- You don't need to create any Notion API keys or integrations; just make sure your Notion page is publicly accessible.
- Resulting image URLs hosted by Notion will work for a short while before becoming inaccessible. This is the same thing that happens with the official Notion app.
- Collections (databases) are supported, including lots of nuanced features like proper number/date/expression/formula formatting, though all databases will be rendered as markdown tables.
- Why's it called `notion-to-md-x`? Because `notion-to-md` was already taken, but this version is based on `react-notion-x` and is much more robust. It outputs Github-Flavored Markdown ([GFM](https://github.github.com/gfm/)) which is very well-supported by all the major LLMs.

## Docs

See the [full docs](https://github.com/NotionX/react-notion-x).

## License

MIT © [Travis Fischer](https://x.com/transitive_bs)

Support my OSS work by [following me on X](https://x.com/transitive_bs).
