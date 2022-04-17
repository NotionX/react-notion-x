[Docs](../README.md) / [notion-types](../modules/notion_types.md) / PdfBlock

# Interface: PdfBlock

[notion-types](../modules/notion_types.md).PdfBlock

## Hierarchy

- [`BaseContentBlock`](notion_types.BaseContentBlock.md)

  ↳ **`PdfBlock`**

## Table of contents

### Properties

- [alive](notion_types.PdfBlock.md#alive)
- [content](notion_types.PdfBlock.md#content)
- [created\_by\_id](notion_types.PdfBlock.md#created_by_id)
- [created\_by\_table](notion_types.PdfBlock.md#created_by_table)
- [created\_time](notion_types.PdfBlock.md#created_time)
- [file\_ids](notion_types.PdfBlock.md#file_ids)
- [format](notion_types.PdfBlock.md#format)
- [id](notion_types.PdfBlock.md#id)
- [last\_edited\_by\_id](notion_types.PdfBlock.md#last_edited_by_id)
- [last\_edited\_by\_table](notion_types.PdfBlock.md#last_edited_by_table)
- [last\_edited\_time](notion_types.PdfBlock.md#last_edited_time)
- [parent\_id](notion_types.PdfBlock.md#parent_id)
- [parent\_table](notion_types.PdfBlock.md#parent_table)
- [properties](notion_types.PdfBlock.md#properties)
- [space\_id](notion_types.PdfBlock.md#space_id)
- [type](notion_types.PdfBlock.md#type)
- [version](notion_types.PdfBlock.md#version)

## Properties

### alive

• **alive**: `boolean`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[alive](notion_types.BaseContentBlock.md#alive)

#### Defined in

[packages/notion-types/src/block.ts:107](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L107)

___

### content

• `Optional` **content**: `string`[]

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[content](notion_types.BaseContentBlock.md#content)

#### Defined in

[packages/notion-types/src/block.ts:98](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L98)

___

### created\_by\_id

• **created\_by\_id**: `string`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[created_by_id](notion_types.BaseContentBlock.md#created_by_id)

#### Defined in

[packages/notion-types/src/block.ts:109](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L109)

___

### created\_by\_table

• **created\_by\_table**: `string`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[created_by_table](notion_types.BaseContentBlock.md#created_by_table)

#### Defined in

[packages/notion-types/src/block.ts:108](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L108)

___

### created\_time

• **created\_time**: `number`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[created_time](notion_types.BaseContentBlock.md#created_time)

#### Defined in

[packages/notion-types/src/block.ts:105](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L105)

___

### file\_ids

• `Optional` **file\_ids**: `string`[]

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[file_ids](notion_types.BaseContentBlock.md#file_ids)

#### Defined in

[packages/notion-types/src/block.ts:139](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L139)

___

### format

• `Optional` **format**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `block_aspect_ratio` | `number` |
| `block_full_width` | `boolean` |
| `block_height` | `number` |
| `block_page_width` | `boolean` |
| `block_preserve_scale` | `boolean` |
| `block_width` | `number` |
| `display_source` | `string` |

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[format](notion_types.BaseContentBlock.md#format)

#### Defined in

[packages/notion-types/src/block.ts:130](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L130)

___

### id

• **id**: `string`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[id](notion_types.BaseContentBlock.md#id)

#### Defined in

[packages/notion-types/src/block.ts:94](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L94)

___

### last\_edited\_by\_id

• **last\_edited\_by\_id**: `string`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[last_edited_by_id](notion_types.BaseContentBlock.md#last_edited_by_id)

#### Defined in

[packages/notion-types/src/block.ts:111](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L111)

___

### last\_edited\_by\_table

• **last\_edited\_by\_table**: `string`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[last_edited_by_table](notion_types.BaseContentBlock.md#last_edited_by_table)

#### Defined in

[packages/notion-types/src/block.ts:110](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L110)

___

### last\_edited\_time

• **last\_edited\_time**: `number`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[last_edited_time](notion_types.BaseContentBlock.md#last_edited_time)

#### Defined in

[packages/notion-types/src/block.ts:106](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L106)

___

### parent\_id

• **parent\_id**: `string`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[parent_id](notion_types.BaseContentBlock.md#parent_id)

#### Defined in

[packages/notion-types/src/block.ts:101](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L101)

___

### parent\_table

• **parent\_table**: `string`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[parent_table](notion_types.BaseContentBlock.md#parent_table)

#### Defined in

[packages/notion-types/src/block.ts:102](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L102)

___

### properties

• **properties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `caption?` | [`Decoration`](../modules/notion_types.md#decoration)[] |
| `source` | `string`[][] |

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[properties](notion_types.BaseContentBlock.md#properties)

#### Defined in

[packages/notion-types/src/block.ts:126](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L126)

___

### space\_id

• `Optional` **space\_id**: `string`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[space_id](notion_types.BaseContentBlock.md#space_id)

#### Defined in

[packages/notion-types/src/block.ts:100](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L100)

___

### type

• **type**: ``"pdf"``

#### Overrides

[BaseContentBlock](notion_types.BaseContentBlock.md).[type](notion_types.BaseContentBlock.md#type)

#### Defined in

[packages/notion-types/src/block.ts:312](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L312)

___

### version

• **version**: `number`

#### Inherited from

[BaseContentBlock](notion_types.BaseContentBlock.md).[version](notion_types.BaseContentBlock.md#version)

#### Defined in

[packages/notion-types/src/block.ts:104](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L104)
