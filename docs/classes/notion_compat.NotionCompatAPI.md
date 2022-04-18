[Docs](../README.md) / [notion-compat](../modules/notion_compat.md) / NotionCompatAPI

# Class: NotionCompatAPI

[notion-compat](../modules/notion_compat.md).NotionCompatAPI

## Table of contents

### Constructors

- [constructor](notion_compat.NotionCompatAPI.md#constructor)

### Properties

- [client](notion_compat.NotionCompatAPI.md#client)

### Methods

- [getAllBlockChildren](notion_compat.NotionCompatAPI.md#getallblockchildren)
- [getPage](notion_compat.NotionCompatAPI.md#getpage)
- [resolvePage](notion_compat.NotionCompatAPI.md#resolvepage)

## Constructors

### constructor

• **new NotionCompatAPI**(`client`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `client` | `default` |

#### Defined in

[packages/notion-compat/src/notion-compat-api.ts:13](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-compat/src/notion-compat-api.ts#L13)

## Properties

### client

• **client**: `default`

#### Defined in

[packages/notion-compat/src/notion-compat-api.ts:11](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-compat/src/notion-compat-api.ts#L11)

## Methods

### getAllBlockChildren

▸ **getAllBlockChildren**(`blockId`): `Promise`<(`PartialBlockObjectResponse` \| `BlockObjectResponse`)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | `string` |

#### Returns

`Promise`<(`PartialBlockObjectResponse` \| `BlockObjectResponse`)[]\>

#### Defined in

[packages/notion-compat/src/notion-compat-api.ts:199](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-compat/src/notion-compat-api.ts#L199)

___

### getPage

▸ **getPage**(`rawPageId`): `Promise`<`ExtendedRecordMap`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawPageId` | `string` |

#### Returns

`Promise`<`ExtendedRecordMap`\>

#### Defined in

[packages/notion-compat/src/notion-compat-api.ts:17](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-compat/src/notion-compat-api.ts#L17)

___

### resolvePage

▸ **resolvePage**(`rootBlockId`, `__namedParameters?`): `Promise`<{ `blockChildrenMap`: `BlockChildrenMap` ; `blockMap`: `BlockMap` ; `pageMap`: `PageMap` ; `parentMap`: `ParentMap`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `rootBlockId` | `string` |
| `__namedParameters` | `Object` |
| `__namedParameters.concurrency?` | `number` |

#### Returns

`Promise`<{ `blockChildrenMap`: `BlockChildrenMap` ; `blockMap`: `BlockMap` ; `pageMap`: `PageMap` ; `parentMap`: `ParentMap`  }\>

#### Defined in

[packages/notion-compat/src/notion-compat-api.ts:45](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-compat/src/notion-compat-api.ts#L45)
