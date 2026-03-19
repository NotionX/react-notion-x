<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-x-to-md.jpg">
</p>

# notion-x-to-md

> Converts a Notion page to Markdown. Very useful for LLMs.

[![NPM](https://img.shields.io/npm/v/notion-x-to-md.svg)](https://www.npmjs.com/package/notion-x-to-md) [![Build Status](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml/badge.svg)](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Features

- ✅ use notion content with LLMs
- ✅ renders all notion blocks including collections
- ✅ renders embedded tweets as markdown
- ✅ works without an API key
- ✅ unit tests
- ✅ free

## Install

```bash
npm install notion-x-to-md
```

## Usage

```ts
import { NotionAPI } from 'notion-client'
import { notionPageToMarkdown } from 'notion-x-to-md'

const api = new NotionAPI()

// fetch a notion page's content
const page = await api.getPage('067dd719a912471ea9a3ac10710e7fdf')

// convert the page to a markdown string
const markdown = await notionPageToMarkdown(page)

console.log(markdown)
```

## CLI

```bash
npx -y notion-x-to-md https://notion.so/067dd719a912471ea9a3ac10710e7fdf
```

```bash
npx -y notion-x-to-md de14421f13914ac7b528fa2e31eb1455
```

```
Usage: notion-x-to-md [options] <page>

Converts a Notion page to Markdown

Arguments:
  page        Notion page ID or URL (must be publicly accessible)

Options:
  -h, --help  display help for command
```

### Examples

| Notion Page                  | Page ID                                                                                | Markdown Output                                      | Supported? | Notes                                                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Notion Kit Test Suite        | [067dd719a912471ea9a3ac10710e7fdf](https://notion.so/067dd719a912471ea9a3ac10710e7fdf) | [md](./examples/067dd719a912471ea9a3ac10710e7fdf.md) | ✅         | index / overview                                                                                                                     |
| Basic Blocks                 | [0be6efce9daf42688f65c76b89f8eb27](https://notion.so/0be6efce9daf42688f65c76b89f8eb27) | [md](./examples/0be6efce9daf42688f65c76b89f8eb27.md) | ✅         |                                                                                                                                      |
| Lists                        | [de14421f13914ac7b528fa2e31eb1455](https://notion.so/de14421f13914ac7b528fa2e31eb1455) | [md](./examples/de14421f13914ac7b528fa2e31eb1455.md) | ✅         |                                                                                                                                      |
| Bookmarks                    | [c1c8f540c06f4ac89f831e4a9cc402ae](https://notion.so/c1c8f540c06f4ac89f831e4a9cc402ae) | [md](./examples/c1c8f540c06f4ac89f831e4a9cc402ae.md) | ✅         | just rendered as links (no images)                                                                                                   |
| Checklists                   | [38fa73d49b8f40aab1f3f8c82332e518](https://notion.so/38fa73d49b8f40aab1f3f8c82332e518) | [md](./examples/38fa73d49b8f40aab1f3f8c82332e518.md) | ✅         |                                                                                                                                      |
| Toggles                      | [5995506f2c564d81956aa38711e12337](https://notion.so/5995506f2c564d81956aa38711e12337) | [md](./examples/5995506f2c564d81956aa38711e12337.md) | ✅         |                                                                                                                                      |
| Links                        | [52353862df0f48ba85648db7d0acd1dd](https://notion.so/52353862df0f48ba85648db7d0acd1dd) | [md](./examples/52353862df0f48ba85648db7d0acd1dd.md) | ✅         |                                                                                                                                      |
| Image Gallery                | [3492bd6dbaf44fe7a5cac62c5d402f06](https://notion.so/3492bd6dbaf44fe7a5cac62c5d402f06) | [md](./examples/3492bd6dbaf44fe7a5cac62c5d402f06.md) | ✅         |                                                                                                                                      |
| Image Upload                 | [912379b0c54440a286619f76446cd753](https://notion.so/912379b0c54440a286619f76446cd753) | [md](./examples/912379b0c54440a286619f76446cd753.md) | ✅         |                                                                                                                                      |
| Math Equations               | [7820b2d5300747b38e31344eb06fbd57](https://notion.so/7820b2d5300747b38e31344eb06fbd57) | [md](./examples/7820b2d5300747b38e31344eb06fbd57.md) | ✅         |                                                                                                                                      |
| Sync Blocks                  | [8bcd65801a5d450fb7218d8890a38c29](https://notion.so/8bcd65801a5d450fb7218d8890a38c29) | [md](./examples/8bcd65801a5d450fb7218d8890a38c29.md) | ✅         |                                                                                                                                      |
| Code Blocks                  | [0c322c33381c49bca5083a451c334c39](https://notion.so/0c322c33381c49bca5083a451c334c39) | [md](./examples/0c322c33381c49bca5083a451c334c39.md) | ✅         |                                                                                                                                      |
| Simple Table                 | [9d9814f3220a4b3bbc2481ad6fd7c913](https://notion.so/9d9814f3220a4b3bbc2481ad6fd7c913) | [md](./examples/9d9814f3220a4b3bbc2481ad6fd7c913.md) | ✅         |                                                                                                                                      |
| Collection Number Formatting | [17aef37fb4624588ab1ff0e6671acba5](https://notion.so/17aef37fb4624588ab1ff0e6671acba5) | [md](./examples/17aef37fb4624588ab1ff0e6671acba5.md) | ✅         |                                                                                                                                      |
| Collections                  | [2fea615a97a7401c81be486e4eec2e94](https://notion.so/2fea615a97a7401c81be486e4eec2e94) | [md](./examples/2fea615a97a7401c81be486e4eec2e94.md) | ☑️         | all collection views rendered as markdown tables                                                                                     |
| Buttons                      | [30bedb27f12481cc9d6afe0976b52e60](https://notion.so/30bedb27f12481cc9d6afe0976b52e60) | [md](./examples/30bedb27f12481cc9d6afe0976b52e60.md) | ☑️         | button labels/actions not rendered                                                                                                   |
| Tweet Embeds                 | [7b7f063709034186adbfb46f455d5065](https://notion.so/7b7f063709034186adbfb46f455d5065) | [md](./examples/7b7f063709034186adbfb46f455d5065.md) | ☑️         | uses [tweet-to-md](https://github.com/transitive-bullshit/tweet-to-md); polls not shown; gif and video tweets show poster image only |
| Embeds                       | [5d4e290ca4604d8fb809af806a6c1749](https://notion.so/5d4e290ca4604d8fb809af806a6c1749) | [md](./examples/5d4e290ca4604d8fb809af806a6c1749.md) | ☑️         | videos shown as link; iframe embeds (Maps, Figma, Drive) render empty                                                                |

### Notes

- You don't need to create any Notion API keys or integrations; just make sure your Notion page is publicly accessible.
- Resulting image URLs hosted by Notion will work for a short while before becoming inaccessible. This is the same thing that happens with the official Notion app.
  - If you want permanent image URLs, you can post-process the `ExtendedRecordMap` returned by `NotionAPI.getPage` to upload the temporary images to a permanent URL, while storing a mapping of block IDs to permanent URLs.
- Collections (databases) are supported, including lots of nuanced features like proper number/date/expression/formula formatting, though all database views will be rendered as markdown tables.
- Why's it called `notion-x-to-md`? Because `notion-to-md` was already taken, but this version is based on `react-notion-x` which has a long history of stable maintenance.
- It outputs Github-Flavored Markdown ([GFM](https://github.github.com/gfm/)) which is well-supported by LLMs.

## License

MIT © [Travis Fischer](https://x.com/transitive_bs)

Support my OSS work by [following me on X](https://x.com/transitive_bs)
