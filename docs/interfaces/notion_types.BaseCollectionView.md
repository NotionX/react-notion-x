[Docs](../README.md) / [notion-types](../modules/notion_types.md) / BaseCollectionView

# Interface: BaseCollectionView

[notion-types](../modules/notion_types.md).BaseCollectionView

## Hierarchy

- **`BaseCollectionView`**

  ↳ [`TableCollectionView`](notion_types.TableCollectionView.md)

  ↳ [`GalleryCollectionView`](notion_types.GalleryCollectionView.md)

  ↳ [`ListCollectionView`](notion_types.ListCollectionView.md)

  ↳ [`BoardCollectionView`](notion_types.BoardCollectionView.md)

  ↳ [`CalendarCollectionView`](notion_types.CalendarCollectionView.md)

## Table of contents

### Properties

- [alive](notion_types.BaseCollectionView.md#alive)
- [format](notion_types.BaseCollectionView.md#format)
- [id](notion_types.BaseCollectionView.md#id)
- [name](notion_types.BaseCollectionView.md#name)
- [parent\_id](notion_types.BaseCollectionView.md#parent_id)
- [parent\_table](notion_types.BaseCollectionView.md#parent_table)
- [query](notion_types.BaseCollectionView.md#query)
- [query2](notion_types.BaseCollectionView.md#query2)
- [type](notion_types.BaseCollectionView.md#type)
- [version](notion_types.BaseCollectionView.md#version)

## Properties

### alive

• **alive**: `boolean`

#### Defined in

[packages/notion-types/src/collection-view.ts:28](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L28)

___

### format

• **format**: `any`

#### Defined in

[packages/notion-types/src/collection-view.ts:25](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L25)

___

### id

• **id**: `string`

#### Defined in

[packages/notion-types/src/collection-view.ts:22](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L22)

___

### name

• **name**: `string`

#### Defined in

[packages/notion-types/src/collection-view.ts:24](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L24)

___

### parent\_id

• **parent\_id**: `string`

#### Defined in

[packages/notion-types/src/collection-view.ts:29](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L29)

___

### parent\_table

• **parent\_table**: `string`

#### Defined in

[packages/notion-types/src/collection-view.ts:30](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L30)

___

### query

• `Optional` **query**: `any`

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

#### Defined in

[packages/notion-types/src/collection-view.ts:34](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L34)

___

### type

• **type**: [`CollectionViewType`](../modules/notion_types.md#collectionviewtype)

#### Defined in

[packages/notion-types/src/collection-view.ts:23](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L23)

___

### version

• **version**: `number`

#### Defined in

[packages/notion-types/src/collection-view.ts:27](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L27)
