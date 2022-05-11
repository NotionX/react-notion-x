<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# notion-compat

> A compatibility layer between the official Notion API and the unofficial Notion API

## Features

- fully compatible with `react-notion-x`
- backwards compatible with `notion-client` and the unofficial notion API

## Usage

```ts
import { Client } from '@notionhq/client'
import { NotionCompatAPI } from 'notion-compat'

const notion = new NotionCompatAPI(
  new Client({ auth: process.env.NOTION_TOKEN })
)

const recordMap = await notion.getPage(pageId)
```

The resulting `recordMap` is compatible with notion's unofficial API and react-notion-x.

## Demo

You can preview `react-notion-x` using the official client and compatibility layer here: https://react-notion-x-official-api-demo.transitivebullsh.it/

## Status

Currently, ~20 blocks have full compatibility and 8 have partial compatibility (sometimes in subtle ways) due Notion's official API not returning enough info for us to faithfully render them in all cases. See the block-by-block compatibility notes below for more info.

I recommend checking out [the notion-compat demo](https://react-notion-x-official-api-demo.transitivebullsh.it/) side-by-side with the [normal react-notion-x demo](https://react-notion-x-demo.transitivebullsh.it/) (which uses the unofficial Notion API via `notion-client`) and the [equivalent public notion page](https://transitive-bs.notion.site/Notion-Kit-Test-Suite-067dd719a912471ea9a3ac10710e7fdf).

Note that using the official API with `notion-compat` is **significantly slower** than using the unofficial API via `notion-client` because of [reasons](https://github.com/NotionX/react-notion-x/issues/269#issuecomment-1100648873).

The main feature missing from `notion-compat` right now is collection (database) support. PRs welcome 😃

## Block Compatibility

### Summary of Known Issues 🔴

- image, video, and embed blocks are missing `format` for proper sizing and layout
  - 3492bd6dbaf44fe7a5cac62c5d402f06
  - 5d4e290ca4604d8fb809af806a6c1749
- image, video, and embed blocks are missing `caption`
  - 912379b0c54440a286619f76446cd753
- embed blocks don't contain enough info for proper embedding
  - have to write custom embedding logic for iframe urls
  - same with some video blocks
  - 5d4e290ca4604d8fb809af806a6c1749
- `alias` blocks fail for links pointing to other workspaces
  - this happens even if the linked page is publicly readable
  - 034119d20132420abe8e9863bbe91e9d
- rich text mentions fail for links to pages and databases in other workspaces
  - if API integration doesn't have access to the workspace
  - this happens even if the linked page is publicly readable
  - 52353862df0f48ba85648db7d0acd1dd
- format `toggleable` is missing
  - no toggle headers
  - 5995506f2c564d81956aa38711e12337

### Blocks with Full Compatibility 🟢

- paragraph (`text` block)
- heading_1 (`header` block)
- heading_2 (`sub_header` block)
- heading_3 (`sub_sub_header` block)
- bulleted_list_item (`bulleted_list` block)
- numbered_list_item (`numbered_list` block)
- quote
- to_do
- toggle
- code
- callout
- file
- divider
- table_of_contents
- column_list
- column
- equation (block and inline)
- synced_block (`transclusion_container` and `transclusion_reference`)
- audio
- tweet

### Blocks with Partial Compatibility 🟡

- bookmark
  - images and content are missing
  - 0be6efce9daf42688f65c76b89f8eb27
- image
  - missing caption
  - missing format so sizing and layout aren't always handled properly
  - 912379b0c54440a286619f76446cd753
- video
  - missing caption
  - missing format so sizing and layout aren't always handled properly
  - missing embedding logic in some cases (original URL must be transformed for embedding in many cases)
  - 5d4e290ca4604d8fb809af806a6c1749
- embed
  - missing caption
  - missing format so sizing and layout aren't always handled properly
  - missing embedding logic
    - original URL must be transformed for embedding in many cases
    - missing embeding display size hints from embedly
  - 5d4e290ca4604d8fb809af806a6c1749
  - this goes for custom embed blocks as well
    - maps
    - figma
    - typeform
    - codepen
    - excalidraw
    - gist
    - loom
    - drive
    - ...
- child_page (`page` block)
  - page format missing entirely
  - no full width, fonts, font size, etc
    - 72c5d33ca46642feaee06852cc57c588
    - 3702a5d6403d4d58b8a944a77ca26c70
  - page cover missing `page_cover_position`
    - 067dd719a912471ea9a3ac10710e7fdf
- link_to_page (`alias` block)
  - missing for links pointing to other workspaces, even if they're publicly readable
  - 034119d20132420abe8e9863bbe91e9d
- pdf
  - missing format so sizing and layout aren't handled properly
- table and table_row (simple table blocks)
  - missing some formatting info

### Blocks that are WIP 🚧

- child_database (`collection_view` and `collection_view_page` blocks)

### Blocks that are Not Supported 🔴

- external_object_instance

### Blocks that I'm not sure how to handle

- breadcrumb
- template
- unsupported

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
