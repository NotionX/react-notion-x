[Docs](../README.md) / [notion-types](../modules/notion_types.md) / GalleryCollectionView

# Interface: GalleryCollectionView

[notion-types](../modules/notion_types.md).GalleryCollectionView

## Hierarchy

- [`BaseCollectionView`](notion_types.BaseCollectionView.md)

  ↳ **`GalleryCollectionView`**

## Table of contents

### Properties

- [alive](notion_types.GalleryCollectionView.md#alive)
- [format](notion_types.GalleryCollectionView.md#format)
- [id](notion_types.GalleryCollectionView.md#id)
- [name](notion_types.GalleryCollectionView.md#name)
- [parent\_id](notion_types.GalleryCollectionView.md#parent_id)
- [parent\_table](notion_types.GalleryCollectionView.md#parent_table)
- [query](notion_types.GalleryCollectionView.md#query)
- [query2](notion_types.GalleryCollectionView.md#query2)
- [type](notion_types.GalleryCollectionView.md#type)
- [version](notion_types.GalleryCollectionView.md#version)

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
| `gallery_cover` | [`CollectionCardCover`](notion_types.CollectionCardCover.md) |
| `gallery_cover_aspect` | [`CollectionCardCoverAspect`](../modules/notion_types.md#collectioncardcoveraspect) |
| `gallery_cover_size` | [`CollectionCardCoverSize`](../modules/notion_types.md#collectioncardcoversize) |
| `gallery_properties` | { `property`: `string` ; `visible`: `boolean`  }[] |

#### Overrides

[BaseCollectionView](notion_types.BaseCollectionView.md).[format](notion_types.BaseCollectionView.md#format)

#### Defined in

[packages/notion-types/src/collection-view.ts:57](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L57)

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

• **type**: ``"gallery"``

#### Overrides

[BaseCollectionView](notion_types.BaseCollectionView.md).[type](notion_types.BaseCollectionView.md#type)

#### Defined in

[packages/notion-types/src/collection-view.ts:56](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L56)

___

### version

• **version**: `number`

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[version](notion_types.BaseCollectionView.md#version)

#### Defined in

[packages/notion-types/src/collection-view.ts:27](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L27)
