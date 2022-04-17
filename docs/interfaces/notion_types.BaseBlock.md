[Docs](../README.md) / [notion-types](../modules/notion_types.md) / BaseBlock

# Interface: BaseBlock

[notion-types](../modules/notion_types.md).BaseBlock

Base properties shared by all blocks.

## Hierarchy

- **`BaseBlock`**

  ↳ [`BaseTextBlock`](notion_types.BaseTextBlock.md)

  ↳ [`BaseContentBlock`](notion_types.BaseContentBlock.md)

  ↳ [`BasePageBlock`](notion_types.BasePageBlock.md)

  ↳ [`BookmarkBlock`](notion_types.BookmarkBlock.md)

  ↳ [`TableOfContentsBlock`](notion_types.TableOfContentsBlock.md)

  ↳ [`DividerBlock`](notion_types.DividerBlock.md)

  ↳ [`ColumnListBlock`](notion_types.ColumnListBlock.md)

  ↳ [`ColumnBlock`](notion_types.ColumnBlock.md)

  ↳ [`CalloutBlock`](notion_types.CalloutBlock.md)

  ↳ [`ToggleBlock`](notion_types.ToggleBlock.md)

  ↳ [`FileBlock`](notion_types.FileBlock.md)

  ↳ [`CodeBlock`](notion_types.CodeBlock.md)

  ↳ [`SyncBlock`](notion_types.SyncBlock.md)

  ↳ [`SyncPointerBlock`](notion_types.SyncPointerBlock.md)

  ↳ [`PageLink`](notion_types.PageLink.md)

  ↳ [`TableBlock`](notion_types.TableBlock.md)

  ↳ [`TableRowBlock`](notion_types.TableRowBlock.md)

  ↳ [`ExternalObjectInstance`](notion_types.ExternalObjectInstance.md)

## Table of contents

### Properties

- [alive](notion_types.BaseBlock.md#alive)
- [content](notion_types.BaseBlock.md#content)
- [created\_by\_id](notion_types.BaseBlock.md#created_by_id)
- [created\_by\_table](notion_types.BaseBlock.md#created_by_table)
- [created\_time](notion_types.BaseBlock.md#created_time)
- [format](notion_types.BaseBlock.md#format)
- [id](notion_types.BaseBlock.md#id)
- [last\_edited\_by\_id](notion_types.BaseBlock.md#last_edited_by_id)
- [last\_edited\_by\_table](notion_types.BaseBlock.md#last_edited_by_table)
- [last\_edited\_time](notion_types.BaseBlock.md#last_edited_time)
- [parent\_id](notion_types.BaseBlock.md#parent_id)
- [parent\_table](notion_types.BaseBlock.md#parent_table)
- [properties](notion_types.BaseBlock.md#properties)
- [space\_id](notion_types.BaseBlock.md#space_id)
- [type](notion_types.BaseBlock.md#type)
- [version](notion_types.BaseBlock.md#version)

## Properties

### alive

• **alive**: `boolean`

#### Defined in

[packages/notion-types/src/block.ts:107](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L107)

___

### content

• `Optional` **content**: `string`[]

#### Defined in

[packages/notion-types/src/block.ts:98](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L98)

___

### created\_by\_id

• **created\_by\_id**: `string`

#### Defined in

[packages/notion-types/src/block.ts:109](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L109)

___

### created\_by\_table

• **created\_by\_table**: `string`

#### Defined in

[packages/notion-types/src/block.ts:108](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L108)

___

### created\_time

• **created\_time**: `number`

#### Defined in

[packages/notion-types/src/block.ts:105](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L105)

___

### format

• `Optional` **format**: `any`

#### Defined in

[packages/notion-types/src/block.ts:97](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L97)

___

### id

• **id**: `string`

#### Defined in

[packages/notion-types/src/block.ts:94](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L94)

___

### last\_edited\_by\_id

• **last\_edited\_by\_id**: `string`

#### Defined in

[packages/notion-types/src/block.ts:111](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L111)

___

### last\_edited\_by\_table

• **last\_edited\_by\_table**: `string`

#### Defined in

[packages/notion-types/src/block.ts:110](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L110)

___

### last\_edited\_time

• **last\_edited\_time**: `number`

#### Defined in

[packages/notion-types/src/block.ts:106](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L106)

___

### parent\_id

• **parent\_id**: `string`

#### Defined in

[packages/notion-types/src/block.ts:101](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L101)

___

### parent\_table

• **parent\_table**: `string`

#### Defined in

[packages/notion-types/src/block.ts:102](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L102)

___

### properties

• `Optional` **properties**: `any`

#### Defined in

[packages/notion-types/src/block.ts:96](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L96)

___

### space\_id

• `Optional` **space\_id**: `string`

#### Defined in

[packages/notion-types/src/block.ts:100](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L100)

___

### type

• **type**: `string`

#### Defined in

[packages/notion-types/src/block.ts:95](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L95)

___

### version

• **version**: `number`

#### Defined in

[packages/notion-types/src/block.ts:104](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L104)
