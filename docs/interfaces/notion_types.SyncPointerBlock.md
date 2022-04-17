[Docs](../README.md) / [notion-types](../modules/notion_types.md) / SyncPointerBlock

# Interface: SyncPointerBlock

[notion-types](../modules/notion_types.md).SyncPointerBlock

## Hierarchy

- [`BaseBlock`](notion_types.BaseBlock.md)

  ↳ **`SyncPointerBlock`**

## Table of contents

### Properties

- [alive](notion_types.SyncPointerBlock.md#alive)
- [content](notion_types.SyncPointerBlock.md#content)
- [created\_by\_id](notion_types.SyncPointerBlock.md#created_by_id)
- [created\_by\_table](notion_types.SyncPointerBlock.md#created_by_table)
- [created\_time](notion_types.SyncPointerBlock.md#created_time)
- [format](notion_types.SyncPointerBlock.md#format)
- [id](notion_types.SyncPointerBlock.md#id-2)
- [last\_edited\_by\_id](notion_types.SyncPointerBlock.md#last_edited_by_id)
- [last\_edited\_by\_table](notion_types.SyncPointerBlock.md#last_edited_by_table)
- [last\_edited\_time](notion_types.SyncPointerBlock.md#last_edited_time)
- [parent\_id](notion_types.SyncPointerBlock.md#parent_id)
- [parent\_table](notion_types.SyncPointerBlock.md#parent_table)
- [properties](notion_types.SyncPointerBlock.md#properties)
- [space\_id](notion_types.SyncPointerBlock.md#space_id)
- [type](notion_types.SyncPointerBlock.md#type)
- [version](notion_types.SyncPointerBlock.md#version)

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
| `copied_from_pointer` | { `id`: `string` ; `spaceid`: `string`  } |
| `copied_from_pointer.id` | `string` |
| `copied_from_pointer.spaceid` | `string` |
| `transclusion_reference_pointer` | { `id`: `string` ; `spaceId`: `string`  } |
| `transclusion_reference_pointer.id` | `string` |
| `transclusion_reference_pointer.spaceId` | `string` |

#### Overrides

[BaseBlock](notion_types.BaseBlock.md).[format](notion_types.BaseBlock.md#format)

#### Defined in

[packages/notion-types/src/block.ts:399](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L399)

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

• **type**: ``"transclusion_reference"``

#### Overrides

[BaseBlock](notion_types.BaseBlock.md).[type](notion_types.BaseBlock.md#type)

#### Defined in

[packages/notion-types/src/block.ts:398](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L398)

___

### version

• **version**: `number`

#### Inherited from

[BaseBlock](notion_types.BaseBlock.md).[version](notion_types.BaseBlock.md#version)

#### Defined in

[packages/notion-types/src/block.ts:104](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L104)
