[Docs](../README.md) / [notion-types](../modules/notion_types.md) / TableCollectionView

# Interface: TableCollectionView

[notion-types](../modules/notion_types.md).TableCollectionView

## Hierarchy

- [`BaseCollectionView`](notion_types.BaseCollectionView.md)

  ↳ **`TableCollectionView`**

## Table of contents

### Properties

- [alive](notion_types.TableCollectionView.md#alive)
- [format](notion_types.TableCollectionView.md#format)
- [id](notion_types.TableCollectionView.md#id)
- [name](notion_types.TableCollectionView.md#name)
- [page\_sort](notion_types.TableCollectionView.md#page_sort)
- [parent\_id](notion_types.TableCollectionView.md#parent_id)
- [parent\_table](notion_types.TableCollectionView.md#parent_table)
- [query](notion_types.TableCollectionView.md#query)
- [query2](notion_types.TableCollectionView.md#query2)
- [type](notion_types.TableCollectionView.md#type)
- [version](notion_types.TableCollectionView.md#version)

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
| `table_properties` | { `property`: `string` ; `visible`: `boolean` ; `width`: `number`  }[] |
| `table_wrap` | `boolean` |

#### Overrides

[BaseCollectionView](notion_types.BaseCollectionView.md).[format](notion_types.BaseCollectionView.md#format)

#### Defined in

[packages/notion-types/src/collection-view.ts:44](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L44)

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

### page\_sort

• **page\_sort**: `string`[]

#### Defined in

[packages/notion-types/src/collection-view.ts:52](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L52)

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

• **type**: ``"table"``

#### Overrides

[BaseCollectionView](notion_types.BaseCollectionView.md).[type](notion_types.BaseCollectionView.md#type)

#### Defined in

[packages/notion-types/src/collection-view.ts:43](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L43)

___

### version

• **version**: `number`

#### Inherited from

[BaseCollectionView](notion_types.BaseCollectionView.md).[version](notion_types.BaseCollectionView.md#version)

#### Defined in

[packages/notion-types/src/collection-view.ts:27](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection-view.ts#L27)
