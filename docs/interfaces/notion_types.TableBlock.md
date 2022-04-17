[Docs](../README.md) / [notion-types](../modules/notion_types.md) / TableBlock

# Interface: TableBlock

[notion-types](../modules/notion_types.md).TableBlock

## Hierarchy

- [`BaseBlock`](notion_types.BaseBlock.md)

  ↳ **`TableBlock`**

## Table of contents

### Properties

- [alive](notion_types.TableBlock.md#alive)
- [collection\_id](notion_types.TableBlock.md#collection_id)
- [content](notion_types.TableBlock.md#content)
- [created\_by\_id](notion_types.TableBlock.md#created_by_id)
- [created\_by\_table](notion_types.TableBlock.md#created_by_table)
- [created\_time](notion_types.TableBlock.md#created_time)
- [format](notion_types.TableBlock.md#format)
- [id](notion_types.TableBlock.md#id-1)
- [last\_edited\_by\_id](notion_types.TableBlock.md#last_edited_by_id)
- [last\_edited\_by\_table](notion_types.TableBlock.md#last_edited_by_table)
- [last\_edited\_time](notion_types.TableBlock.md#last_edited_time)
- [parent\_id](notion_types.TableBlock.md#parent_id)
- [parent\_table](notion_types.TableBlock.md#parent_table)
- [properties](notion_types.TableBlock.md#properties)
- [space\_id](notion_types.TableBlock.md#space_id)
- [type](notion_types.TableBlock.md#type)
- [version](notion_types.TableBlock.md#version)
- [view\_ids](notion_types.TableBlock.md#view_ids)

## Properties

### alive

• **alive**: `boolean`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[alive](notion_types.BaseBlock.md#alive)

#### Defined in

[packages/notion-types/src/block.ts:107](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L107)

___

### collection\_id

• **collection\_id**: `string`

#### Defined in

[packages/notion-types/src/block.ts:422](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L422)

___

### content

• `Optional` **content**: `string`[]

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[content](notion_types.BaseBlock.md#content)

#### Defined in

[packages/notion-types/src/block.ts:98](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L98)

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

• **format**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `collection_pointer` | { `id`: `string` ; `spaceId`: `string` ; `table`: `string`  } |
| `collection_pointer.id` | `string` |
| `collection_pointer.spaceId` | `string` |
| `collection_pointer.table` | `string` |
| `table_block_column_format?` | { `[column: string]`: { `color?`: [`Color`](../modules/notion_types.md#color) ; `width?`: `number`  };  } |
| `table_block_column_header` | `boolean` |
| `table_block_column_order` | `string`[] |

#### Overrides

[BaseBlock](notion_types.BaseBlock.md).[format](notion_types.BaseBlock.md#format)

#### Defined in

[packages/notion-types/src/block.ts:423](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L423)

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

• `Optional` **properties**: `any`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[properties](notion_types.BaseBlock.md#properties)

#### Defined in

[packages/notion-types/src/block.ts:96](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L96)

___

### space\_id

• `Optional` **space\_id**: `string`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[space_id](notion_types.BaseBlock.md#space_id)

#### Defined in

[packages/notion-types/src/block.ts:100](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L100)

___

### type

• **type**: ``"table"``

#### Overrides

[BaseBlock](notion_types.BaseBlock.md).[type](notion_types.BaseBlock.md#type)

#### Defined in

[packages/notion-types/src/block.ts:421](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L421)

___

### version

• **version**: `number`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[version](notion_types.BaseBlock.md#version)

#### Defined in

[packages/notion-types/src/block.ts:104](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L104)

___

### view\_ids

• **view\_ids**: `string`[]

#### Defined in

[packages/notion-types/src/block.ts:435](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L435)
