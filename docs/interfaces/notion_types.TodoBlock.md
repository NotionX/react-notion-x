[Docs](../README.md) / [notion-types](../modules/notion_types.md) / TodoBlock

# Interface: TodoBlock

[notion-types](../modules/notion_types.md).TodoBlock

## Hierarchy

- [`BaseTextBlock`](notion_types.BaseTextBlock.md)

  ↳ **`TodoBlock`**

## Table of contents

### Properties

- [alive](notion_types.TodoBlock.md#alive)
- [content](notion_types.TodoBlock.md#content)
- [created\_by\_id](notion_types.TodoBlock.md#created_by_id)
- [created\_by\_table](notion_types.TodoBlock.md#created_by_table)
- [created\_time](notion_types.TodoBlock.md#created_time)
- [format](notion_types.TodoBlock.md#format)
- [id](notion_types.TodoBlock.md#id)
- [last\_edited\_by\_id](notion_types.TodoBlock.md#last_edited_by_id)
- [last\_edited\_by\_table](notion_types.TodoBlock.md#last_edited_by_table)
- [last\_edited\_time](notion_types.TodoBlock.md#last_edited_time)
- [parent\_id](notion_types.TodoBlock.md#parent_id)
- [parent\_table](notion_types.TodoBlock.md#parent_table)
- [properties](notion_types.TodoBlock.md#properties)
- [space\_id](notion_types.TodoBlock.md#space_id)
- [type](notion_types.TodoBlock.md#type)
- [version](notion_types.TodoBlock.md#version)

## Properties

### alive

• **alive**: `boolean`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[alive](notion_types.BaseTextBlock.md#alive)

#### Defined in

[packages/notion-types/src/block.ts:107](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L107)

___

### content

• `Optional` **content**: `string`[]

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[content](notion_types.BaseTextBlock.md#content)

#### Defined in

[packages/notion-types/src/block.ts:116](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L116)

___

### created\_by\_id

• **created\_by\_id**: `string`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[created_by_id](notion_types.BaseTextBlock.md#created_by_id)

#### Defined in

[packages/notion-types/src/block.ts:109](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L109)

___

### created\_by\_table

• **created\_by\_table**: `string`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[created_by_table](notion_types.BaseTextBlock.md#created_by_table)

#### Defined in

[packages/notion-types/src/block.ts:108](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L108)

___

### created\_time

• **created\_time**: `number`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[created_time](notion_types.BaseTextBlock.md#created_time)

#### Defined in

[packages/notion-types/src/block.ts:105](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L105)

___

### format

• `Optional` **format**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `block_color` | [`Color`](../modules/notion_types.md#color) |

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[format](notion_types.BaseTextBlock.md#format)

#### Defined in

[packages/notion-types/src/block.ts:120](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L120)

___

### id

• **id**: `string`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[id](notion_types.BaseTextBlock.md#id)

#### Defined in

[packages/notion-types/src/block.ts:94](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L94)

___

### last\_edited\_by\_id

• **last\_edited\_by\_id**: `string`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[last_edited_by_id](notion_types.BaseTextBlock.md#last_edited_by_id)

#### Defined in

[packages/notion-types/src/block.ts:111](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L111)

___

### last\_edited\_by\_table

• **last\_edited\_by\_table**: `string`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[last_edited_by_table](notion_types.BaseTextBlock.md#last_edited_by_table)

#### Defined in

[packages/notion-types/src/block.ts:110](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L110)

___

### last\_edited\_time

• **last\_edited\_time**: `number`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[last_edited_time](notion_types.BaseTextBlock.md#last_edited_time)

#### Defined in

[packages/notion-types/src/block.ts:106](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L106)

___

### parent\_id

• **parent\_id**: `string`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[parent_id](notion_types.BaseTextBlock.md#parent_id)

#### Defined in

[packages/notion-types/src/block.ts:101](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L101)

___

### parent\_table

• **parent\_table**: `string`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[parent_table](notion_types.BaseTextBlock.md#parent_table)

#### Defined in

[packages/notion-types/src/block.ts:102](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L102)

___

### properties

• **properties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `checked` | ([``"Yes"``] \| [``"No"``])[] |
| `title` | [`Decoration`](../modules/notion_types.md#decoration)[] |

#### Overrides

[BaseTextBlock](notion_types.BaseTextBlock.md).[properties](notion_types.BaseTextBlock.md#properties)

#### Defined in

[packages/notion-types/src/block.ts:225](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L225)

___

### space\_id

• `Optional` **space\_id**: `string`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[space_id](notion_types.BaseTextBlock.md#space_id)

#### Defined in

[packages/notion-types/src/block.ts:100](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L100)

___

### type

• **type**: ``"to_do"``

#### Overrides

[BaseTextBlock](notion_types.BaseTextBlock.md).[type](notion_types.BaseTextBlock.md#type)

#### Defined in

[packages/notion-types/src/block.ts:224](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L224)

___

### version

• **version**: `number`

#### Inherited from

[BaseTextBlock](notion_types.BaseTextBlock.md).[version](notion_types.BaseTextBlock.md#version)

#### Defined in

[packages/notion-types/src/block.ts:104](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L104)
