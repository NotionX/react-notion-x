<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# notion-to-md-x

> Converts a Notion page to Markdown. Useful for using Notion with LLMs.

[![NPM](https://img.shields.io/npm/v/notion-to-md-x.svg)](https://www.npmjs.com/package/notion-to-md-x) [![Build Status](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml/badge.svg)](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Features

- ✅ supports all notion blocks including collections
- ✅ embed notion pages or blocks as context for LLMs
- ✅ automatically embeds tweets
- ✅ works without an API key
- ✅ free

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
const markdown = await notionPageToMarkdown(page)

console.log(markdown)
```

### Notes

- You don't need to create any Notion API keys or integrations; just make sure your Notion page is publicly accessible.
- Resulting image URLs hosted by Notion will work for a short while before becoming inaccessible. This is the same thing that happens with the official Notion app.
- Collections (databases) are supported, including lots of nuanced features like proper number/date/expression/formula formatting, though all databases will be rendered as markdown tables.
- Why's it called `notion-to-md-x`? Because `notion-to-md` was already taken, but this version is based on `react-notion-x` and is much more robust.
- It outputs Github-Flavored Markdown ([GFM](https://github.github.com/gfm/)) which is well-supported by LLMs.

### Examples

| Suite Page            | Page ID                                                                                | Markdown                                             | Supported | Notes                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Notion Kit Test Suite | [067dd719a912471ea9a3ac10710e7fdf](https://notion.so/067dd719a912471ea9a3ac10710e7fdf) | [md](./examples/067dd719a912471ea9a3ac10710e7fdf.md) | ✅        | index / overview                                                                                                             |
| Lists                 | [de14421f13914ac7b528fa2e31eb1455](https://notion.so/de14421f13914ac7b528fa2e31eb1455) | [md](./examples/de14421f13914ac7b528fa2e31eb1455.md) | ✅        |                                                                                                                              |
| Basic Blocks          | [0be6efce9daf42688f65c76b89f8eb27](https://notion.so/0be6efce9daf42688f65c76b89f8eb27) | [md](./examples/0be6efce9daf42688f65c76b89f8eb27.md) | ✅        |                                                                                                                              |
| Bookmarks             | [c1c8f540c06f4ac89f831e4a9cc402ae](https://notion.so/c1c8f540c06f4ac89f831e4a9cc402ae) | [md](./examples/c1c8f540c06f4ac89f831e4a9cc402ae.md) | ✅        |                                                                                                                              |
| Checklists            | [38fa73d49b8f40aab1f3f8c82332e518](https://notion.so/38fa73d49b8f40aab1f3f8c82332e518) | [md](./examples/38fa73d49b8f40aab1f3f8c82332e518.md) | ✅        |                                                                                                                              |
| Toggles               | [5995506f2c564d81956aa38711e12337](https://notion.so/5995506f2c564d81956aa38711e12337) | [md](./examples/5995506f2c564d81956aa38711e12337.md) | ✅        |                                                                                                                              |
| Image Gallery         | [3492bd6dbaf44fe7a5cac62c5d402f06](https://notion.so/3492bd6dbaf44fe7a5cac62c5d402f06) | [md](./examples/3492bd6dbaf44fe7a5cac62c5d402f06.md) | ✅        |                                                                                                                              |
| Image Upload          | [912379b0c54440a286619f76446cd753](https://notion.so/912379b0c54440a286619f76446cd753) | [md](./examples/912379b0c54440a286619f76446cd753.md) | ✅        |                                                                                                                              |
| Math Equations        | [7820b2d5300747b38e31344eb06fbd57](https://notion.so/7820b2d5300747b38e31344eb06fbd57) | [md](./examples/7820b2d5300747b38e31344eb06fbd57.md) | ✅        |                                                                                                                              |
| Sync Blocks           | [8bcd65801a5d450fb7218d8890a38c29](https://notion.so/8bcd65801a5d450fb7218d8890a38c29) | [md](./examples/8bcd65801a5d450fb7218d8890a38c29.md) | ✅        |                                                                                                                              |
| Links                 | [52353862df0f48ba85648db7d0acd1dd](https://notion.so/52353862df0f48ba85648db7d0acd1dd) | [md](./examples/52353862df0f48ba85648db7d0acd1dd.md) | ✅        |                                                                                                                              |
| Number Formatting     | [17aef37fb4624588ab1ff0e6671acba5](https://notion.so/17aef37fb4624588ab1ff0e6671acba5) | [md](./examples/17aef37fb4624588ab1ff0e6671acba5.md) | ✅        | collection number formatting                                                                                                 |
| Simple Table          | [9d9814f3220a4b3bbc2481ad6fd7c913](https://notion.so/9d9814f3220a4b3bbc2481ad6fd7c913) | [md](./examples/9d9814f3220a4b3bbc2481ad6fd7c913.md) | ✅        |                                                                                                                              |
| Code Blocks           | [0c322c33381c49bca5083a451c334c39](https://notion.so/0c322c33381c49bca5083a451c334c39) | [md](./examples/0c322c33381c49bca5083a451c334c39.md) | ✅        |                                                                                                                              |
| Buttons               | [30bedb27f12481cc9d6afe0976b52e60](https://notion.so/30bedb27f12481cc9d6afe0976b52e60) | [md](./examples/30bedb27f12481cc9d6afe0976b52e60.md) | ☑️        | button labels/actions not rendered                                                                                           |
| Tweet Embeds          | [7b7f063709034186adbfb46f455d5065](https://notion.so/7b7f063709034186adbfb46f455d5065) | [md](./examples/7b7f063709034186adbfb46f455d5065.md) | ☑️        | uses [tweet-to-md](https://github.com/transitive-bullshit/tweet-to-md); polls not shown; video tweets show poster image only |
| Embeds                | [5d4e290ca4604d8fb809af806a6c1749](https://notion.so/5d4e290ca4604d8fb809af806a6c1749) | [md](./examples/5d4e290ca4604d8fb809af806a6c1749.md) | ☑️        | videos shown as link; iframe embeds (Maps, Figma, Drive) render empty                                                        |

## Docs

See the [full docs](https://github.com/NotionX/react-notion-x).

## License

MIT © [Travis Fischer](https://x.com/transitive_bs)

Support my OSS work by [following me on X](https://x.com/transitive_bs).
