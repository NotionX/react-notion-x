[Docs](../README.md) / [notion-types](../modules/notion_types.md) / ListCollectionView

# Interface: ListCollectionView

[notion-types](../modules/notion_types.md).ListCollectionView

## Hierarchy

- [`BaseCollectionView`](notion_types.BaseCollectionView.md)

  ↳ **`ListCollectionView`**

## Table of contents

### Properties

- [alive](notion_types.ListCollectionView.md#alive)
- [format](notion_types.ListCollectionView.md#format)
- [id](notion_types.ListCollectionView.md#id)
- [name](notion_types.ListCollectionView.md#name)
- [parent\_id](notion_types.ListCollectionView.md#parent_id)
- [parent\_table](notion_types.ListCollectionView.md#parent_table)
- [query](notion_types.ListCollectionView.md#query)
- [query2](notion_types.ListCollectionView.md#query2)
- [type](notion_types.ListCollectionView.md#type)
- [version](notion_types.ListCollectionView.md#version)

## Properties

### alive

• **alive**: `boolean`

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[alive](notion_types.BaseCollectionView.md#alive)

#### Defined in

[packages/notion-types/src/collection-view.ts:28](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L28)

___

### format

• **format**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `list_properties` | { `property`: `string` ; `visible`: `boolean`  }[] |

#### Overrides

[BaseCollectionView](notion_types.BaseCollectionView.md).[format](notion_types.BaseCollectionView.md#format)

#### Defined in

[packages/notion-types/src/collection-view.ts:71](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L71)

___

### id

• **id**: `string`

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[id](notion_types.BaseCollectionView.md#id)

#### Defined in

[packages/notion-types/src/collection-view.ts:22](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L22)

___

### name

• **name**: `string`

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[name](notion_types.BaseCollectionView.md#name)

#### Defined in

[packages/notion-types/src/collection-view.ts:24](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L24)

___

### parent\_id

• **parent\_id**: `string`

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[parent_id](notion_types.BaseCollectionView.md#parent_id)

#### Defined in

[packages/notion-types/src/collection-view.ts:29](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L29)

___

### parent\_table

• **parent\_table**: `string`

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[parent_table](notion_types.BaseCollectionView.md#parent_table)

#### Defined in

[packages/notion-types/src/collection-view.ts:30](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L30)

___

### query

• `Optional` **query**: `any`

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[query](notion_types.BaseCollectionView.md#query)

#### Defined in

[packages/notion-types/src/collection-view.ts:32](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L32)

___

### query2

• **query2**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `aggregations?` | `object`[] |
| `filter?` | `any` |
| `group_by` | `string` |

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[query2](notion_types.BaseCollectionView.md#query2)

#### Defined in

[packages/notion-types/src/collection-view.ts:34](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L34)

___

### type

• **type**: ``"list"``

#### Overrides

[BaseCollectionView](notion_types.BaseCollectionView.md).[type](notion_types.BaseCollectionView.md#type)

#### Defined in

[packages/notion-types/src/collection-view.ts:70](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L70)

___

### version

• **version**: `number`

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[version](notion_types.BaseCollectionView.md#version)

#### Defined in

[packages/notion-types/src/collection-view.ts:27](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L27)
