[Docs](../README.md) / [notion-types](../modules/notion_types.md) / PageBlock

# Interface: PageBlock

[notion-types](../modules/notion_types.md).PageBlock

## Hierarchy

- [`BasePageBlock`](notion_types.BasePageBlock.md)

  ↳ **`PageBlock`**

## Table of contents

### Properties

- [alive](notion_types.PageBlock.md#alive)
- [content](notion_types.PageBlock.md#content)
- [created\_by\_id](notion_types.PageBlock.md#created_by_id)
- [created\_by\_table](notion_types.PageBlock.md#created_by_table)
- [created\_time](notion_types.PageBlock.md#created_time)
- [file\_ids](notion_types.PageBlock.md#file_ids)
- [format](notion_types.PageBlock.md#format)
- [id](notion_types.PageBlock.md#id)
- [last\_edited\_by\_id](notion_types.PageBlock.md#last_edited_by_id)
- [last\_edited\_by\_table](notion_types.PageBlock.md#last_edited_by_table)
- [last\_edited\_time](notion_types.PageBlock.md#last_edited_time)
- [parent\_id](notion_types.PageBlock.md#parent_id)
- [parent\_table](notion_types.PageBlock.md#parent_table)
- [permissions](notion_types.PageBlock.md#permissions)
- [properties](notion_types.PageBlock.md#properties)
- [space\_id](notion_types.PageBlock.md#space_id)
- [type](notion_types.PageBlock.md#type)
- [version](notion_types.PageBlock.md#version)

## Properties

### alive

• **alive**: `boolean`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[alive](notion_types.BasePageBlock.md#alive)

#### Defined in

[packages/notion-types/src/block.ts:107](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L107)

___

### content

• `Optional` **content**: `string`[]

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[content](notion_types.BasePageBlock.md#content)

#### Defined in

[packages/notion-types/src/block.ts:98](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L98)

___

### created\_by\_id

• **created\_by\_id**: `string`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[created_by_id](notion_types.BasePageBlock.md#created_by_id)

#### Defined in

[packages/notion-types/src/block.ts:109](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L109)

___

### created\_by\_table

• **created\_by\_table**: `string`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[created_by_table](notion_types.BasePageBlock.md#created_by_table)

#### Defined in

[packages/notion-types/src/block.ts:108](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L108)

___

### created\_time

• **created\_time**: `number`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[created_time](notion_types.BasePageBlock.md#created_time)

#### Defined in

[packages/notion-types/src/block.ts:105](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L105)

___

### file\_ids

• `Optional` **file\_ids**: `string`[]

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[file_ids](notion_types.BasePageBlock.md#file_ids)

#### Defined in

[packages/notion-types/src/block.ts:157](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L157)

___

### format

• **format**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `block_color?` | [`Color`](../modules/notion_types.md#color) |
| `block_locked?` | `boolean` |
| `block_locked_by?` | `string` |
| `page_cover?` | `string` |
| `page_cover_position?` | `number` |
| `page_full_width?` | `boolean` |
| `page_icon?` | `string` |
| `page_small_text?` | `boolean` |

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[format](notion_types.BasePageBlock.md#format)

#### Defined in

[packages/notion-types/src/block.ts:146](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L146)

___

### id

• **id**: `string`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[id](notion_types.BasePageBlock.md#id)

#### Defined in

[packages/notion-types/src/block.ts:94](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L94)

___

### last\_edited\_by\_id

• **last\_edited\_by\_id**: `string`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[last_edited_by_id](notion_types.BasePageBlock.md#last_edited_by_id)

#### Defined in

[packages/notion-types/src/block.ts:111](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L111)

___

### last\_edited\_by\_table

• **last\_edited\_by\_table**: `string`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[last_edited_by_table](notion_types.BasePageBlock.md#last_edited_by_table)

#### Defined in

[packages/notion-types/src/block.ts:110](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L110)

___

### last\_edited\_time

• **last\_edited\_time**: `number`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[last_edited_time](notion_types.BasePageBlock.md#last_edited_time)

#### Defined in

[packages/notion-types/src/block.ts:106](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L106)

___

### parent\_id

• **parent\_id**: `string`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[parent_id](notion_types.BasePageBlock.md#parent_id)

#### Defined in

[packages/notion-types/src/block.ts:101](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L101)

___

### parent\_table

• **parent\_table**: `string`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[parent_table](notion_types.BasePageBlock.md#parent_table)

#### Defined in

[packages/notion-types/src/block.ts:102](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L102)

___

### permissions

• **permissions**: { `role`: [`Role`](../modules/notion_types.md#role) ; `type`: `string`  }[]

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[permissions](notion_types.BasePageBlock.md#permissions)

#### Defined in

[packages/notion-types/src/block.ts:156](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L156)

___

### properties

• `Optional` **properties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `title` | [`Decoration`](../modules/notion_types.md#decoration)[] |

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[properties](notion_types.BasePageBlock.md#properties)

#### Defined in

[packages/notion-types/src/block.ts:143](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L143)

___

### space\_id

• `Optional` **space\_id**: `string`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[space_id](notion_types.BasePageBlock.md#space_id)

#### Defined in

[packages/notion-types/src/block.ts:100](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L100)

___

### type

• **type**: ``"page"``

#### Overrides

[BasePageBlock](notion_types.BasePageBlock.md).[type](notion_types.BasePageBlock.md#type)

#### Defined in

[packages/notion-types/src/block.ts:161](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L161)

___

### version

• **version**: `number`

#### Inherited from

[BasePageBlock](notion_types.BasePageBlock.md).[version](notion_types.BasePageBlock.md#version)

#### Defined in

[packages/notion-types/src/block.ts:104](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L104)
