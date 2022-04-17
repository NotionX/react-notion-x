[Docs](../README.md) / notion-utils

# Module: notion-utils

## Table of contents

### Interfaces

- [NotionDateTime](../interfaces/notion_utils.NotionDateTime.md)
- [TableOfContentsEntry](../interfaces/notion_utils.TableOfContentsEntry.md)

### Functions

- [formatDate](notion_utils.md#formatdate)
- [formatNotionDateTime](notion_utils.md#formatnotiondatetime)
- [getAllPagesInSpace](notion_utils.md#getallpagesinspace)
- [getBlockCollectionId](notion_utils.md#getblockcollectionid)
- [getBlockIcon](notion_utils.md#getblockicon)
- [getBlockParentPage](notion_utils.md#getblockparentpage)
- [getBlockTitle](notion_utils.md#getblocktitle)
- [getCanonicalPageId](notion_utils.md#getcanonicalpageid)
- [getDateValue](notion_utils.md#getdatevalue)
- [getPageBreadcrumbs](notion_utils.md#getpagebreadcrumbs)
- [getPageContentBlockIds](notion_utils.md#getpagecontentblockids)
- [getPageImageUrls](notion_utils.md#getpageimageurls)
- [getPageProperty](notion_utils.md#getpageproperty)
- [getPageTableOfContents](notion_utils.md#getpagetableofcontents)
- [getPageTitle](notion_utils.md#getpagetitle)
- [getTextContent](notion_utils.md#gettextcontent)
- [idToUuid](notion_utils.md#idtouuid)
- [isUrl](notion_utils.md#isurl)
- [mergeRecordMaps](notion_utils.md#mergerecordmaps)
- [normalizeTitle](notion_utils.md#normalizetitle)
- [normalizeUrl](notion_utils.md#normalizeurl)
- [parsePageId](notion_utils.md#parsepageid)
- [uuidToId](notion_utils.md#uuidtoid)

## Functions

### formatDate

▸ **formatDate**(`input`, `__namedParameters?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` \| `number` |
| `__namedParameters` | `Object` |
| `__namedParameters.month?` | ``"long"`` \| ``"short"`` |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/format-date.ts:1](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/format-date.ts#L1)

___

### formatNotionDateTime

▸ **formatNotionDateTime**(`datetime`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `datetime` | [`NotionDateTime`](../interfaces/notion_utils.NotionDateTime.md) |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/format-notion-date-time.ts:10](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/format-notion-date-time.ts#L10)

___

### getAllPagesInSpace

▸ **getAllPagesInSpace**(`rootPageId`, `rootSpaceId`, `getPage`, `opts?`): `Promise`<`PageMap`\>

Performs a traversal over a given Notion workspace starting from a seed page.

Returns a map containing all of the pages that are reachable from the seed
page in the space.

If `rootSpaceId` is not defined, the space ID of the root page will be used
to scope traversal.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rootPageId` | `string` | Page ID to start from. |
| `rootSpaceId` | `string` | Space ID to scope traversal. |
| `getPage` | (`pageId`: `string`) => `Promise`<`ExtendedRecordMap`\> | Function used to fetch a single page. |
| `opts` | `Object` | Optional config |
| `opts.concurrency?` | `number` | - |
| `opts.targetPageId?` | `string` | - |
| `opts.traverseCollections?` | `boolean` | - |

#### Returns

`Promise`<`PageMap`\>

#### Defined in

[packages/notion-utils/src/get-all-pages-in-space.ts:21](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-all-pages-in-space.ts#L21)

___

### getBlockCollectionId

▸ **getBlockCollectionId**(`block`, `recordMap`): `string` \| ``null``

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `Block` |
| `recordMap` | `ExtendedRecordMap` |

#### Returns

`string` \| ``null``

#### Defined in

[packages/notion-utils/src/get-block-collection-id.ts:3](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-block-collection-id.ts#L3)

___

### getBlockIcon

▸ **getBlockIcon**(`block`, `recordMap`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `Block` |
| `recordMap` | `ExtendedRecordMap` |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/get-block-icon.ts:4](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-block-icon.ts#L4)

___

### getBlockParentPage

▸ **getBlockParentPage**(`block`, `recordMap`, `__namedParameters?`): `PageBlock`

Returns the parent page block containing a given page.

Note that many times this will not be the direct parent block since
some non-page content blocks can contain sub-blocks.

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `Block` |
| `recordMap` | `ExtendedRecordMap` |
| `__namedParameters` | `Object` |
| `__namedParameters.inclusive?` | `boolean` |

#### Returns

`PageBlock`

#### Defined in

[packages/notion-utils/src/get-block-parent-page.ts:9](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-block-parent-page.ts#L9)

___

### getBlockTitle

▸ **getBlockTitle**(`block`, `recordMap`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `Block` |
| `recordMap` | `ExtendedRecordMap` |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/get-block-title.ts:5](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-block-title.ts#L5)

___

### getCanonicalPageId

▸ **getCanonicalPageId**(`pageId`, `recordMap`, `__namedParameters?`): `string`

Gets the canonical, display-friendly version of a page's ID for use in URLs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageId` | `string` |
| `recordMap` | `ExtendedRecordMap` |
| `__namedParameters` | `Object` |
| `__namedParameters.uuid?` | `boolean` |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/get-canonical-page-id.ts:10](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-canonical-page-id.ts#L10)

___

### getDateValue

▸ **getDateValue**(`prop`): `FormattedDate`

Attempts to find a valid date from a given property.

#### Parameters

| Name | Type |
| :------ | :------ |
| `prop` | `any`[] |

#### Returns

`FormattedDate`

#### Defined in

[packages/notion-utils/src/get-date-value.ts:6](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-date-value.ts#L6)

___

### getPageBreadcrumbs

▸ **getPageBreadcrumbs**(`recordMap`, `activePageId`): `any`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `recordMap` | `ExtendedRecordMap` |
| `activePageId` | `string` |

#### Returns

`any`[]

#### Defined in

[packages/notion-utils/src/get-page-breadcrumbs.ts:6](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-page-breadcrumbs.ts#L6)

___

### getPageContentBlockIds

▸ **getPageContentBlockIds**(`recordMap`, `blockId?`): `string`[]

Gets the IDs of all blocks contained on a page starting from a root block ID.

#### Parameters

| Name | Type |
| :------ | :------ |
| `recordMap` | `ExtendedRecordMap` |
| `blockId?` | `string` |

#### Returns

`string`[]

#### Defined in

[packages/notion-utils/src/get-page-content-block-ids.ts:6](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-page-content-block-ids.ts#L6)

___

### getPageImageUrls

▸ **getPageImageUrls**(`recordMap`, `__namedParameters`): `string`[]

Gets URLs of all images contained on the given page.

#### Parameters

| Name | Type |
| :------ | :------ |
| `recordMap` | `ExtendedRecordMap` |
| `__namedParameters` | `Object` |
| `__namedParameters.mapImageUrl` | (`url`: `string`, `block`: `Block`) => `string` |

#### Returns

`string`[]

#### Defined in

[packages/notion-utils/src/get-page-image-urls.ts:8](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-page-image-urls.ts#L8)

___

### getPageProperty

▸ **getPageProperty**<`T`\>(`propertyName`, `block`, `recordMap`): `T`

Gets the value of a collection property for a given page (collection item).

**`todo`** complete all no-text property type

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` \| `number` \| `boolean` \| `string`[] \| `number`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `propertyName` | `string` | property name |
| `block` | `Block` | Page block, often be first block in blockMap |
| `recordMap` | `ExtendedRecordMap` |  |

#### Returns

`T`

- The return value types will follow the following principles:
 1. if property is date type, it will return `number` or `number[]`(depends on `End Date` switch)
 2. property is text-like will return `string`
 3. multi select property will return `string[]`
 4. checkbox property return `boolean`

#### Defined in

[packages/notion-utils/src/get-page-property.ts:17](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-page-property.ts#L17)

___

### getPageTableOfContents

▸ **getPageTableOfContents**(`page`, `recordMap`): [`TableOfContentsEntry`](../interfaces/notion_utils.TableOfContentsEntry.md)[]

Gets the metadata for a table of contents block by parsing the page's
H1, H2, and H3 elements.

#### Parameters

| Name | Type |
| :------ | :------ |
| `page` | `PageBlock` |
| `recordMap` | `ExtendedRecordMap` |

#### Returns

[`TableOfContentsEntry`](../interfaces/notion_utils.TableOfContentsEntry.md)[]

#### Defined in

[packages/notion-utils/src/get-page-table-of-contents.ts:21](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-page-table-of-contents.ts#L21)

___

### getPageTitle

▸ **getPageTitle**(`recordMap`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `recordMap` | `ExtendedRecordMap` |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/get-page-title.ts:4](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-page-title.ts#L4)

___

### getTextContent

▸ **getTextContent**(`text?`): `string`

Gets the raw, unformatted text content of a block's content value.

This is useful, for instance, for extracting a block's `title` without any
rich text formatting.

#### Parameters

| Name | Type |
| :------ | :------ |
| `text?` | `Decoration`[] |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/get-text-content.ts:9](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/get-text-content.ts#L9)

___

### idToUuid

▸ **idToUuid**(`id?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `''` |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/id-to-uuid.ts:1](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/id-to-uuid.ts#L1)

___

### isUrl

▸ **isUrl**(`url`, `options?`): `boolean`

Check if a string is a URL.

**`example`**
```
import isUrl from 'is-url-superb';

isUrl('https://sindresorhus.com');
//=> true

isUrl('unicorn');
//=> false
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `options?` | `Options` |

#### Returns

`boolean`

#### Defined in

node_modules/is-url-superb/index.d.ts:35

___

### mergeRecordMaps

▸ **mergeRecordMaps**(`recordMapA`, `recordMapB`): `ExtendedRecordMap`

#### Parameters

| Name | Type |
| :------ | :------ |
| `recordMapA` | `ExtendedRecordMap` |
| `recordMapB` | `ExtendedRecordMap` |

#### Returns

`ExtendedRecordMap`

#### Defined in

[packages/notion-utils/src/merge-record-maps.ts:3](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/merge-record-maps.ts#L3)

___

### normalizeTitle

▸ **normalizeTitle**(`title?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `title?` | `string` |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/normalize-title.ts:1](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/normalize-title.ts#L1)

___

### normalizeUrl

▸ **normalizeUrl**(`url?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url?` | `string` |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/normalize-url.ts:4](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/normalize-url.ts#L4)

___

### parsePageId

▸ **parsePageId**(`id?`, `__namedParameters?`): `string`

Robustly extracts the notion page ID from a notion URL or pathname suffix.

Defaults to returning a UUID (with dashes).

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `id` | `string` | `''` |
| `__namedParameters` | `Object` | `{}` |
| `__namedParameters.uuid?` | `boolean` | `undefined` |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/parse-page-id.ts:12](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/parse-page-id.ts#L12)

___

### uuidToId

▸ **uuidToId**(`uuid`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `uuid` | `string` |

#### Returns

`string`

#### Defined in

[packages/notion-utils/src/uuid-to-id.ts:1](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-utils/src/uuid-to-id.ts#L1)
