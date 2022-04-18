[Docs](../README.md) / [notion-types](../modules/notion_types.md) / BaseTextBlock

# Interface: BaseTextBlock

[notion-types](../modules/notion_types.md).BaseTextBlock

## Hierarchy

- [`BaseBlock`](notion_types.BaseBlock.md)

  ↳ **`BaseTextBlock`**

  ↳↳ [`TextBlock`](notion_types.TextBlock.md)

  ↳↳ [`BulletedListBlock`](notion_types.BulletedListBlock.md)

  ↳↳ [`NumberedListBlock`](notion_types.NumberedListBlock.md)

  ↳↳ [`HeaderBlock`](notion_types.HeaderBlock.md)

  ↳↳ [`SubHeaderBlock`](notion_types.SubHeaderBlock.md)

  ↳↳ [`SubSubHeaderBlock`](notion_types.SubSubHeaderBlock.md)

  ↳↳ [`QuoteBlock`](notion_types.QuoteBlock.md)

  ↳↳ [`EquationBlock`](notion_types.EquationBlock.md)

  ↳↳ [`TodoBlock`](notion_types.TodoBlock.md)

## Table of contents

### Properties

- [alive](notion_types.BaseTextBlock.md#alive)
- [content](notion_types.BaseTextBlock.md#content)
- [created\_by\_id](notion_types.BaseTextBlock.md#created_by_id)
- [created\_by\_table](notion_types.BaseTextBlock.md#created_by_table)
- [created\_time](notion_types.BaseTextBlock.md#created_time)
- [format](notion_types.BaseTextBlock.md#format)
- [id](notion_types.BaseTextBlock.md#id)
- [last\_edited\_by\_id](notion_types.BaseTextBlock.md#last_edited_by_id)
- [last\_edited\_by\_table](notion_types.BaseTextBlock.md#last_edited_by_table)
- [last\_edited\_time](notion_types.BaseTextBlock.md#last_edited_time)
- [parent\_id](notion_types.BaseTextBlock.md#parent_id)
- [parent\_table](notion_types.BaseTextBlock.md#parent_table)
- [properties](notion_types.BaseTextBlock.md#properties)
- [space\_id](notion_types.BaseTextBlock.md#space_id)
- [type](notion_types.BaseTextBlock.md#type)
- [version](notion_types.BaseTextBlock.md#version)

## Properties

### alive

• **alive**: `boolean`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[alive](notion_types.BaseBlock.md#alive)

#### Defined in

[packages/notion-types/src/block.ts:107](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L107)

___

### content

• `Optional` **content**: `string`[]

#### Overrides

[BaseBlock](notion_types.BaseBlock.md).[content](notion_types.BaseBlock.md#content)

#### Defined in

[packages/notion-types/src/block.ts:116](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L116)

___

### created\_by\_id

• **created\_by\_id**: `string`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[created_by_id](notion_types.BaseBlock.md#created_by_id)

#### Defined in

[packages/notion-types/src/block.ts:109](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L109)

___

### created\_by\_table

• **created\_by\_table**: `string`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[created_by_table](notion_types.BaseBlock.md#created_by_table)

#### Defined in

[packages/notion-types/src/block.ts:108](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L108)

___

### created\_time

• **created\_time**: `number`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[created_time](notion_types.BaseBlock.md#created_time)

#### Defined in

[packages/notion-types/src/block.ts:105](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L105)

___

### format

• `Optional` **format**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `block_color` | [`Color`](../modules/notion_types.md#color) |

#### Overrides

[BaseBlock](notion_types.BaseBlock.md).[format](notion_types.BaseBlock.md#format)

#### Defined in

[packages/notion-types/src/block.ts:120](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L120)

___

### id

• **id**: `string`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[id](notion_types.BaseBlock.md#id)

#### Defined in

[packages/notion-types/src/block.ts:94](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L94)

___

### last\_edited\_by\_id

• **last\_edited\_by\_id**: `string`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[last_edited_by_id](notion_types.BaseBlock.md#last_edited_by_id)

#### Defined in

[packages/notion-types/src/block.ts:111](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L111)

___

### last\_edited\_by\_table

• **last\_edited\_by\_table**: `string`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[last_edited_by_table](notion_types.BaseBlock.md#last_edited_by_table)

#### Defined in

[packages/notion-types/src/block.ts:110](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L110)

___

### last\_edited\_time

• **last\_edited\_time**: `number`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[last_edited_time](notion_types.BaseBlock.md#last_edited_time)

#### Defined in

[packages/notion-types/src/block.ts:106](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L106)

___

### parent\_id

• **parent\_id**: `string`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[parent_id](notion_types.BaseBlock.md#parent_id)

#### Defined in

[packages/notion-types/src/block.ts:101](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L101)

___

### parent\_table

• **parent\_table**: `string`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[parent_table](notion_types.BaseBlock.md#parent_table)

#### Defined in

[packages/notion-types/src/block.ts:102](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L102)

___

### properties

• `Optional` **properties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `title` | [`Decoration`](../modules/notion_types.md#decoration)[] |

#### Overrides

[BaseBlock](notion_types.BaseBlock.md).[properties](notion_types.BaseBlock.md#properties)

#### Defined in

[packages/notion-types/src/block.ts:117](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L117)

___

### space\_id

• `Optional` **space\_id**: `string`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[space_id](notion_types.BaseBlock.md#space_id)

#### Defined in

[packages/notion-types/src/block.ts:100](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L100)

___

### type

• **type**: `string`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[type](notion_types.BaseBlock.md#type)

#### Defined in

[packages/notion-types/src/block.ts:95](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L95)

___

### version

• **version**: `number`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[version](notion_types.BaseBlock.md#version)

#### Defined in

[packages/notion-types/src/block.ts:104](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L104)
