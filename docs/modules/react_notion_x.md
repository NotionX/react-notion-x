[Docs](../README.md) / react-notion-x

# Module: react-notion-x

## Table of contents

### Interfaces

- [CollectionCardProps](../interfaces/react_notion_x.CollectionCardProps.md)
- [CollectionGroupProps](../interfaces/react_notion_x.CollectionGroupProps.md)
- [CollectionViewProps](../interfaces/react_notion_x.CollectionViewProps.md)
- [NotionComponents](../interfaces/react_notion_x.NotionComponents.md)
- [NotionContext](../interfaces/react_notion_x.NotionContext.md)
- [PartialNotionContext](../interfaces/react_notion_x.PartialNotionContext.md)

### Type aliases

- [ComponentOverrideFn](react_notion_x.md#componentoverridefn)
- [MapImageUrlFn](react_notion_x.md#mapimageurlfn)
- [MapPageUrlFn](react_notion_x.md#mappageurlfn)
- [SearchNotionFn](react_notion_x.md#searchnotionfn)

### Variables

- [Breadcrumbs](react_notion_x.md#breadcrumbs)
- [Header](react_notion_x.md#header)
- [NotionContextConsumer](react_notion_x.md#notioncontextconsumer)
- [NotionContextProvider](react_notion_x.md#notioncontextprovider)
- [NotionRenderer](react_notion_x.md#notionrenderer)
- [Search](react_notion_x.md#search)
- [Text](react_notion_x.md#text)
- [isBrowser](react_notion_x.md#isbrowser)

### Functions

- [cs](react_notion_x.md#cs)
- [defaultMapImageUrl](react_notion_x.md#defaultmapimageurl)
- [defaultMapPageUrl](react_notion_x.md#defaultmappageurl)
- [dummyLink](react_notion_x.md#dummylink)
- [formatDate](react_notion_x.md#formatdate)
- [formatNotionDateTime](react_notion_x.md#formatnotiondatetime)
- [getHashFragmentValue](react_notion_x.md#gethashfragmentvalue)
- [getListNumber](react_notion_x.md#getlistnumber)
- [getYoutubeId](react_notion_x.md#getyoutubeid)
- [isUrl](react_notion_x.md#isurl)
- [useNotionContext](react_notion_x.md#usenotioncontext)

## Type aliases

### ComponentOverrideFn

Ƭ **ComponentOverrideFn**: (`props`: `any`, `defaultValueFn`: () => `React.ReactNode`) => `any`

#### Type declaration

▸ (`props`, `defaultValueFn`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `props` | `any` |
| `defaultValueFn` | () => `React.ReactNode` |

##### Returns

`any`

#### Defined in

[packages/react-notion-x/src/types.ts:13](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/types.ts#L13)

___

### MapImageUrlFn

Ƭ **MapImageUrlFn**: (`url`: `string`, `block`: `types.Block`) => `string`

#### Type declaration

▸ (`url`, `block`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `block` | `types.Block` |

##### Returns

`string`

#### Defined in

[packages/react-notion-x/src/types.ts:8](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/types.ts#L8)

___

### MapPageUrlFn

Ƭ **MapPageUrlFn**: (`pageId`: `string`, `recordMap?`: `types.ExtendedRecordMap`) => `string`

#### Type declaration

▸ (`pageId`, `recordMap?`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `pageId` | `string` |
| `recordMap?` | `types.ExtendedRecordMap` |

##### Returns

`string`

#### Defined in

[packages/react-notion-x/src/types.ts:4](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/types.ts#L4)

___

### SearchNotionFn

Ƭ **SearchNotionFn**: (`params`: `types.SearchParams`) => `Promise`<`types.SearchResults`\>

#### Type declaration

▸ (`params`): `Promise`<`types.SearchResults`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `types.SearchParams` |

##### Returns

`Promise`<`types.SearchResults`\>

#### Defined in

[packages/react-notion-x/src/types.ts:9](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/types.ts#L9)

## Variables

### Breadcrumbs

• `Const` **Breadcrumbs**: `React.FC`<{ `block`: `types.Block` ; `rootOnly?`: `boolean`  }\>

#### Defined in

[packages/react-notion-x/src/components/header.tsx:27](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/components/header.tsx#L27)

___

### Header

• `Const` **Header**: `React.FC`<{ `block`: `types.CollectionViewPageBlock` \| `types.PageBlock`  }\>

#### Defined in

[packages/react-notion-x/src/components/header.tsx:14](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/components/header.tsx#L14)

___

### NotionContextConsumer

• `Const` **NotionContextConsumer**: `Consumer`<[`NotionContext`](../interfaces/react_notion_x.NotionContext.md)\> = `ctx.Consumer`

#### Defined in

[packages/react-notion-x/src/context.tsx:223](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/context.tsx#L223)

___

### NotionContextProvider

• `Const` **NotionContextProvider**: `React.FC`<[`PartialNotionContext`](../interfaces/react_notion_x.PartialNotionContext.md)\>

#### Defined in

[packages/react-notion-x/src/context.tsx:171](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/context.tsx#L171)

___

### NotionRenderer

• `Const` **NotionRenderer**: `React.FC`<{ `blockId?`: `string` ; `bodyClassName?`: `string` ; `className?`: `string` ; `components?`: `Partial`<[`NotionComponents`](../interfaces/react_notion_x.NotionComponents.md)\> ; `darkMode?`: `boolean` ; `defaultPageCover?`: `string` ; `defaultPageCoverPosition?`: `number` ; `defaultPageIcon?`: `string` ; `disableHeader?`: `boolean` ; `footer?`: `React.ReactNode` ; `forceCustomImages?`: `boolean` ; `fullPage?`: `boolean` ; `header?`: `React.ReactNode` ; `hideBlockId?`: `boolean` ; `linkTableTitleProperties?`: `boolean` ; `mapImageUrl?`: [`MapImageUrlFn`](react_notion_x.md#mapimageurlfn) ; `mapPageUrl?`: [`MapPageUrlFn`](react_notion_x.md#mappageurlfn) ; `minTableOfContentsItems?`: `number` ; `pageAside?`: `React.ReactNode` ; `pageCover?`: `React.ReactNode` ; `pageFooter?`: `React.ReactNode` ; `pageHeader?`: `React.ReactNode` ; `pageTitle?`: `React.ReactNode` ; `previewImages?`: `boolean` ; `recordMap`: `ExtendedRecordMap` ; `rootDomain?`: `string` ; `rootPageId?`: `string` ; `searchNotion?`: [`SearchNotionFn`](react_notion_x.md#searchnotionfn) ; `showCollectionViewDropdown?`: `boolean` ; `showTableOfContents?`: `boolean`  }\>

#### Defined in

[packages/react-notion-x/src/renderer.tsx:14](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/renderer.tsx#L14)

___

### Search

• `Const` **Search**: `React.FC`<{ `block`: `types.Block` ; `search?`: [`SearchNotionFn`](react_notion_x.md#searchnotionfn) ; `title?`: `React.ReactNode`  }\>

#### Defined in

[packages/react-notion-x/src/components/header.tsx:85](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/components/header.tsx#L85)

___

### Text

• `Const` **Text**: `React.FC`<{ `block`: `Block` ; `inline?`: `boolean` ; `linkProps?`: `any` ; `linkProtocol?`: `string` ; `value`: `Decoration`[]  }\>

Renders a single piece of Notion text, including basic rich text formatting.

These represent the innermost leaf nodes of a Notion subtree.

TODO: I think this implementation would be more correct if the reduce just added
attributes to the final element's style.

#### Defined in

[packages/react-notion-x/src/components/text.tsx:19](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/components/text.tsx#L19)

___

### isBrowser

• `Const` **isBrowser**: `boolean`

#### Defined in

[packages/react-notion-x/src/utils.ts:121](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/utils.ts#L121)

## Functions

### cs

▸ **cs**(...`classes`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...classes` | (`string` \| ``false``)[] |

#### Returns

`string`

#### Defined in

[packages/react-notion-x/src/utils.ts:72](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/utils.ts#L72)

___

### defaultMapImageUrl

▸ **defaultMapImageUrl**(`url`, `block`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `block` | `Block` |

#### Returns

`string`

#### Defined in

[packages/react-notion-x/src/utils.ts:6](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/utils.ts#L6)

___

### defaultMapPageUrl

▸ **defaultMapPageUrl**(`rootPageId?`): (`pageId`: `string`) => `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootPageId?` | `string` |

#### Returns

`fn`

▸ (`pageId`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `pageId` | `string` |

##### Returns

`string`

#### Defined in

[packages/react-notion-x/src/utils.ts:62](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/utils.ts#L62)

___

### dummyLink

▸ **dummyLink**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |

#### Returns

`Element`

#### Defined in

[packages/react-notion-x/src/context.tsx:82](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/context.tsx#L82)

___

### formatDate

▸ **formatDate**(`input`, `__namedParameters?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` \| `number` |
| `__namedParameters?` | `Object` |
| `__namedParameters.month?` | ``"long"`` \| ``"short"`` |

#### Returns

`string`

#### Defined in

packages/notion-utils/build/format-date.d.ts:1

___

### formatNotionDateTime

▸ **formatNotionDateTime**(`datetime`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `datetime` | `NotionDateTime` |

#### Returns

`string`

#### Defined in

packages/notion-utils/build/format-notion-date-time.d.ts:7

___

### getHashFragmentValue

▸ **getHashFragmentValue**(`url`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`string`

#### Defined in

[packages/react-notion-x/src/utils.ts:117](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/utils.ts#L117)

___

### getListNumber

▸ **getListNumber**(`blockId`, `blockMap`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | `string` |
| `blockMap` | `BlockMap` |

#### Returns

`number`

#### Defined in

[packages/react-notion-x/src/utils.ts:106](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/utils.ts#L106)

___

### getYoutubeId

▸ **getYoutubeId**(`url`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`string`

#### Defined in

[packages/react-notion-x/src/utils.ts:131](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/utils.ts#L131)

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

### useNotionContext

▸ **useNotionContext**(): [`NotionContext`](../interfaces/react_notion_x.NotionContext.md)

#### Returns

[`NotionContext`](../interfaces/react_notion_x.NotionContext.md)

#### Defined in

[packages/react-notion-x/src/context.tsx:225](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/react-notion-x/src/context.tsx#L225)
