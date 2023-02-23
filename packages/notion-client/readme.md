<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# notion-client

> Robust TypeScript client for the unofficial Notion API.

[![NPM](https://img.shields.io/npm/v/notion-client.svg)](https://www.npmjs.com/package/notion-client) [![Build Status](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml/badge.svg)](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

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
const collectionData = await api.getCollectionData(
  collectionId,
  collectionViewId
)
```

### Fetch a database's content

You can pass a database ID to the `getPage` method. The response is an object which contains several important properties:

- `block`
- `collection`
- `collection_view`

The value of the `block` property maps the id of each block object present in the database to its corresponding properties like type, parent id, created time, last edited by, and more. 

```
{
  block: {
    'cc368b47-772a-4a1a-a36e-1f52c507d20d': { role: 'reader', value: [Object] },
    '97dbe6d5-aea3-4e03-b571-91810cf975d4': { role: 'reader', value: [Object] },
    '08d5ba1e-03d2-4d4a-add7-a414f297ff8a': { role: 'reader', value: [Object] },
    '7aad4627-c4af-4314-960e-1465e76cc6bd': { role: 'reader', value: [Object] },
    '7be73360-19b9-4b77-a518-70acd610d492': { role: 'reader', value: [Object] },
    'af961803-cd0c-470e-bd27-1d025baa2f95': { role: 'reader', value: [Object] },
    // ...
  }
}
```

The map of blocks is arranged as followed:

- The first id is of the collection view
- The second is of the parent page that contains the database in question
- The next ids are of all the children pages inside the database
- After that comes all the children blocks of each page.


Please note that a block object can take many types: header, text, list, media, and almost any block supported by Notion. It can also be *a page* or a *collection view*.

Example of a block object of type `text`:

```
{
  role: 'reader',
  value: {
    id: '0377e1a4-dc3d-4daf-99dd-f54f986d932e',
    version: 1,
    type: 'text',
    properties: { title: [Array] },
    format: { copied_from_pointer: [Object] },
    created_time: 1655961814278,
    last_edited_time: 1655961814278,
    parent_id: '08d5ba1e-03d2-4d4a-add7-a414f297ff8a',
    parent_table: 'block',
    alive: true,
    copied_from: '526d2008-0d0b-46f8-9de1-7411a85bff7b',
    created_by_table: 'notion_user',
    created_by_id: '55b29a2b-a8fe-4a11-9f9d-ada341bd922b',
    last_edited_by_table: 'notion_user',
    last_edited_by_id: '55b29a2b-a8fe-4a11-9f9d-ada341bd922b',
    space_id: '6b70425f-211e-4318-80c6-5d093df8f7eb'
  }
}
```

Example of a block object of type `page`:

```
{
  role: 'reader',
  value: {
    id: 'af961803-cd0c-470e-bd27-1d025baa2f95',
    version: 31,
    type: 'page',
    properties: { '==~K': [Array], 'BN]P': [Array], title: [Array] },
    content: [
      '8cbf7053-da37-4d69-8cde-89343baf3623',
      '0fc1712e-852c-4307-b72b-094dadaa86ba'
    ],
    created_time: 1655962200000,
    last_edited_time: 1655979420000,
    parent_id: '175482e5-870d-4da8-980c-ead469427316',
    parent_table: 'collection',
    alive: true,
    created_by_table: 'notion_user',
    created_by_id: '55b29a2b-a8fe-4a11-9f9d-ada341bd922b',
    last_edited_by_table: 'notion_user',
    last_edited_by_id: '55b29a2b-a8fe-4a11-9f9d-ada341bd922b',
    space_id: '6b70425f-211e-4318-80c6-5d093df8f7eb'
  }
}
```

Example of a block object of type `collection_view`:
```
{
  role: 'reader',
  value: {
    id: 'cc368b47-772a-4a1a-a36e-1f52c507d20d',
    version: 5,
    type: 'collection_view',
    view_ids: [
      '028f6968-2a6c-46da-bf43-cb44e6d91765',
      '77f32047-52dd-422e-93fa-813438087e57'
    ],
    collection_id: '175482e5-870d-4da8-980c-ead469427316',
    format: { collection_pointer: [Object], copied_from_pointer: [Object] },
    created_time: 1655961814276,
    last_edited_time: 1656075900000,
    parent_id: '97dbe6d5-aea3-4e03-b571-91810cf975d4',
    parent_table: 'block',
    alive: true,
    copied_from: '3e3073e9-7aee-481c-b831-765e112ec7b5',
    created_by_table: 'notion_user',
    created_by_id: '55b29a2b-a8fe-4a11-9f9d-ada341bd922b',
    last_edited_by_table: 'notion_user',
    last_edited_by_id: '55b29a2b-a8fe-4a11-9f9d-ada341bd922b',
    space_id: '6b70425f-211e-4318-80c6-5d093df8f7eb'
  }
}
```

## Docs

See the [full docs](https://github.com/NotionX/react-notion-x).

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
