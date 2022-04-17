[Docs](../README.md) / [notion-client](../modules/notion_client.md) / NotionAPI

# Class: NotionAPI

[notion-client](../modules/notion_client.md).NotionAPI

Main Notion API client.

## Table of contents

### Constructors

- [constructor](notion_client.NotionAPI.md#constructor)

### Properties

- [\_activeUser](notion_client.NotionAPI.md#_activeuser)
- [\_apiBaseUrl](notion_client.NotionAPI.md#_apibaseurl)
- [\_authToken](notion_client.NotionAPI.md#_authtoken)
- [\_userTimeZone](notion_client.NotionAPI.md#_usertimezone)

### Methods

- [addSignedUrls](notion_client.NotionAPI.md#addsignedurls)
- [fetch](notion_client.NotionAPI.md#fetch)
- [getBlocks](notion_client.NotionAPI.md#getblocks)
- [getCollectionData](notion_client.NotionAPI.md#getcollectiondata)
- [getPage](notion_client.NotionAPI.md#getpage)
- [getPageRaw](notion_client.NotionAPI.md#getpageraw)
- [getSignedFileUrls](notion_client.NotionAPI.md#getsignedfileurls)
- [getUsers](notion_client.NotionAPI.md#getusers)
- [search](notion_client.NotionAPI.md#search)

## Constructors

### constructor

• **new NotionAPI**(`__namedParameters?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.activeUser?` | `string` |
| `__namedParameters.apiBaseUrl?` | `string` |
| `__namedParameters.authToken?` | `string` |
| `__namedParameters.userLocale?` | `string` |
| `__namedParameters.userTimeZone?` | `string` |

#### Defined in

[packages/notion-client/src/notion-api.ts:24](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L24)

## Properties

### \_activeUser

• `Private` `Optional` `Readonly` **\_activeUser**: `string`

#### Defined in

[packages/notion-client/src/notion-api.ts:21](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L21)

___

### \_apiBaseUrl

• `Private` `Readonly` **\_apiBaseUrl**: `string`

#### Defined in

[packages/notion-client/src/notion-api.ts:19](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L19)

___

### \_authToken

• `Private` `Optional` `Readonly` **\_authToken**: `string`

#### Defined in

[packages/notion-client/src/notion-api.ts:20](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L20)

___

### \_userTimeZone

• `Private` `Readonly` **\_userTimeZone**: `string`

#### Defined in

[packages/notion-client/src/notion-api.ts:22](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L22)

## Methods

### addSignedUrls

▸ **addSignedUrls**(`__namedParameters`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.contentBlockIds?` | `string`[] |
| `__namedParameters.gotOptions?` | `OptionsOfJSONResponseBody` |
| `__namedParameters.recordMap` | `ExtendedRecordMap` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/notion-client/src/notion-api.ts:204](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L204)

___

### fetch

▸ **fetch**<`T`\>(`__namedParameters`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.body` | `object` |
| `__namedParameters.endpoint` | `string` |
| `__namedParameters.gotOptions?` | `OptionsOfJSONResponseBody` |
| `__namedParameters.headers?` | `any` |

#### Returns

`Promise`<`T`\>

#### Defined in

[packages/notion-client/src/notion-api.ts:567](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L567)

___

### getBlocks

▸ **getBlocks**(`blockIds`, `gotOptions?`): `Promise`<`PageChunk`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockIds` | `string`[] |
| `gotOptions?` | `OptionsOfJSONResponseBody` |

#### Returns

`Promise`<`PageChunk`\>

#### Defined in

[packages/notion-client/src/notion-api.ts:504](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L504)

___

### getCollectionData

▸ **getCollectionData**(`collectionId`, `collectionViewId`, `collectionView`, `__namedParameters?`): `Promise`<`CollectionInstance`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `collectionId` | `string` |
| `collectionViewId` | `string` |
| `collectionView` | `any` |
| `__namedParameters` | `Object` |
| `__namedParameters.gotOptions?` | `OptionsOfJSONResponseBody` |
| `__namedParameters.limit?` | `number` |
| `__namedParameters.loadContentCover?` | `boolean` |
| `__namedParameters.searchQuery?` | `string` |
| `__namedParameters.type?` | `CollectionViewType` |
| `__namedParameters.userLocale?` | `string` |
| `__namedParameters.userTimeZone?` | `string` |

#### Returns

`Promise`<`CollectionInstance`\>

#### Defined in

[packages/notion-client/src/notion-api.ts:309](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L309)

___

### getPage

▸ **getPage**(`pageId`, `__namedParameters?`): `Promise`<`ExtendedRecordMap`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageId` | `string` |
| `__namedParameters` | `Object` |
| `__namedParameters.chunkLimit?` | `number` |
| `__namedParameters.chunkNumber?` | `number` |
| `__namedParameters.concurrency?` | `number` |
| `__namedParameters.fetchCollections?` | `boolean` |
| `__namedParameters.fetchMissingBlocks?` | `boolean` |
| `__namedParameters.gotOptions?` | `OptionsOfJSONResponseBody` |
| `__namedParameters.signFileUrls?` | `boolean` |

#### Returns

`Promise`<`ExtendedRecordMap`\>

#### Defined in

[packages/notion-client/src/notion-api.ts:42](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L42)

___

### getPageRaw

▸ **getPageRaw**(`pageId`, `__namedParameters?`): `Promise`<`PageChunk`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pageId` | `string` |
| `__namedParameters` | `Object` |
| `__namedParameters.chunkLimit?` | `number` |
| `__namedParameters.chunkNumber?` | `number` |
| `__namedParameters.gotOptions?` | `OptionsOfJSONResponseBody` |

#### Returns

`Promise`<`PageChunk`\>

#### Defined in

[packages/notion-client/src/notion-api.ts:276](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L276)

___

### getSignedFileUrls

▸ **getSignedFileUrls**(`urls`, `gotOptions?`): `Promise`<[`SignedUrlResponse`](../interfaces/notion_client.SignedUrlResponse.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `urls` | [`SignedUrlRequest`](../interfaces/notion_client.SignedUrlRequest.md)[] |
| `gotOptions?` | `OptionsOfJSONResponseBody` |

#### Returns

`Promise`<[`SignedUrlResponse`](../interfaces/notion_client.SignedUrlResponse.md)\>

#### Defined in

[packages/notion-client/src/notion-api.ts:522](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L522)

___

### getUsers

▸ **getUsers**(`userIds`, `gotOptions?`): `Promise`<`RecordValues`<`User`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userIds` | `string`[] |
| `gotOptions?` | `OptionsOfJSONResponseBody` |

#### Returns

`Promise`<`RecordValues`<`User`\>\>

#### Defined in

[packages/notion-client/src/notion-api.ts:491](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L491)

___

### search

▸ **search**(`params`, `gotOptions?`): `Promise`<`SearchResults`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `SearchParams` |
| `gotOptions?` | `OptionsOfJSONResponseBody` |

#### Returns

`Promise`<`SearchResults`\>

#### Defined in

[packages/notion-client/src/notion-api.ts:535](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-client/src/notion-api.ts#L535)
