[Docs](../README.md) / [notion-types](../modules/notion_types.md) / Collection

# Interface: Collection

[notion-types](../modules/notion_types.md).Collection

## Table of contents

### Properties

- [alive](notion_types.Collection.md#alive)
- [copied\_from](notion_types.Collection.md#copied_from)
- [format](notion_types.Collection.md#format)
- [icon](notion_types.Collection.md#icon)
- [id](notion_types.Collection.md#id)
- [name](notion_types.Collection.md#name)
- [parent\_id](notion_types.Collection.md#parent_id)
- [parent\_table](notion_types.Collection.md#parent_table)
- [schema](notion_types.Collection.md#schema)
- [template\_pages](notion_types.Collection.md#template_pages)
- [version](notion_types.Collection.md#version)

## Properties

### alive

• **alive**: `boolean`

#### Defined in

[packages/notion-types/src/collection.ts:38](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L38)

___

### copied\_from

• **copied\_from**: `string`

#### Defined in

[packages/notion-types/src/collection.ts:39](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L39)

___

### format

• `Optional` **format**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `collection_page_properties?` | { `property`: `string` ; `visible`: `boolean`  }[] |
| `property_visibility?` | { `property`: `string` ; `visibility`: ``"show"`` \| ``"hide"``  }[] |

#### Defined in

[packages/notion-types/src/collection.ts:42](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L42)

___

### icon

• **icon**: `string`

#### Defined in

[packages/notion-types/src/collection.ts:35](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L35)

___

### id

• **id**: `string`

#### Defined in

[packages/notion-types/src/collection.ts:31](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L31)

___

### name

• **name**: [`Decoration`](../modules/notion_types.md#decoration)[]

#### Defined in

[packages/notion-types/src/collection.ts:33](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L33)

___

### parent\_id

• **parent\_id**: `string`

#### Defined in

[packages/notion-types/src/collection.ts:36](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L36)

___

### parent\_table

• **parent\_table**: `string`

#### Defined in

[packages/notion-types/src/collection.ts:37](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L37)

___

### schema

• **schema**: [`CollectionPropertySchemaMap`](notion_types.CollectionPropertySchemaMap.md)

#### Defined in

[packages/notion-types/src/collection.ts:34](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L34)

___

### template\_pages

• `Optional` **template\_pages**: `string`[]

#### Defined in

[packages/notion-types/src/collection.ts:40](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L40)

___

### version

• **version**: `number`

#### Defined in

[packages/notion-types/src/collection.ts:32](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/collection.ts#L32)
