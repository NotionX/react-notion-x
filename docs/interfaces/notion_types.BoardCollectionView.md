[Docs](../README.md) / [notion-types](../modules/notion_types.md) / BoardCollectionView

# Interface: BoardCollectionView

[notion-types](../modules/notion_types.md).BoardCollectionView

## Hierarchy

- [`BaseCollectionView`](notion_types.BaseCollectionView.md)

  ↳ **`BoardCollectionView`**

## Table of contents

### Properties

- [alive](notion_types.BoardCollectionView.md#alive)
- [format](notion_types.BoardCollectionView.md#format)
- [id](notion_types.BoardCollectionView.md#id)
- [name](notion_types.BoardCollectionView.md#name)
- [parent\_id](notion_types.BoardCollectionView.md#parent_id)
- [parent\_table](notion_types.BoardCollectionView.md#parent_table)
- [query](notion_types.BoardCollectionView.md#query)
- [query2](notion_types.BoardCollectionView.md#query2)
- [type](notion_types.BoardCollectionView.md#type)
- [version](notion_types.BoardCollectionView.md#version)

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
| `board_columns` | { `hidden`: `boolean` ; `property`: `string` ; `value`: { `type`: [`PropertyType`](../modules/notion_types.md#propertytype) ; `value`: `string`  }  }[] |
| `board_cover` | [`CollectionCardCover`](notion_types.CollectionCardCover.md) |
| `board_cover_aspect` | [`CollectionCardCoverAspect`](../modules/notion_types.md#collectioncardcoveraspect) |
| `board_cover_size` | [`CollectionCardCoverSize`](../modules/notion_types.md#collectioncardcoversize) |
| `board_groups2` | { `hidden`: `boolean` ; `property`: `string` ; `value`: { `type`: [`PropertyType`](../modules/notion_types.md#propertytype) ; `value`: `string`  }  }[] |
| `board_properties` | { `property`: `string` ; `visible`: `boolean`  }[] |

#### Overrides

[BaseCollectionView](notion_types.BaseCollectionView.md).[format](notion_types.BaseCollectionView.md#format)

#### Defined in

[packages/notion-types/src/collection-view.ts:86](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L86)

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

• **type**: ``"board"``

#### Overrides

[BaseCollectionView](notion_types.BaseCollectionView.md).[type](notion_types.BaseCollectionView.md#type)

#### Defined in

[packages/notion-types/src/collection-view.ts:85](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L85)

___

### version

• **version**: `number`

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[version](notion_types.BaseCollectionView.md#version)

#### Defined in

[packages/notion-types/src/collection-view.ts:27](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L27)
