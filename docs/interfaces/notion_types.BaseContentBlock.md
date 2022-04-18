[Docs](../README.md) / [notion-types](../modules/notion_types.md) / BaseContentBlock

# Interface: BaseContentBlock

[notion-types](../modules/notion_types.md).BaseContentBlock

## Hierarchy

- [`BaseBlock`](notion_types.BaseBlock.md)

  ↳ **`BaseContentBlock`**

  ↳↳ [`ImageBlock`](notion_types.ImageBlock.md)

  ↳↳ [`EmbedBlock`](notion_types.EmbedBlock.md)

  ↳↳ [`GistBlock`](notion_types.GistBlock.md)

  ↳↳ [`VideoBlock`](notion_types.VideoBlock.md)

  ↳↳ [`FigmaBlock`](notion_types.FigmaBlock.md)

  ↳↳ [`TypeformBlock`](notion_types.TypeformBlock.md)

  ↳↳ [`CodepenBlock`](notion_types.CodepenBlock.md)

  ↳↳ [`ExcalidrawBlock`](notion_types.ExcalidrawBlock.md)

  ↳↳ [`TweetBlock`](notion_types.TweetBlock.md)

  ↳↳ [`MapsBlock`](notion_types.MapsBlock.md)

  ↳↳ [`PdfBlock`](notion_types.PdfBlock.md)

  ↳↳ [`AudioBlock`](notion_types.AudioBlock.md)

  ↳↳ [`GoogleDriveBlock`](notion_types.GoogleDriveBlock.md)

  ↳↳ [`CollectionViewBlock`](notion_types.CollectionViewBlock.md)

## Table of contents

### Properties

- [alive](notion_types.BaseContentBlock.md#alive)
- [content](notion_types.BaseContentBlock.md#content)
- [created\_by\_id](notion_types.BaseContentBlock.md#created_by_id)
- [created\_by\_table](notion_types.BaseContentBlock.md#created_by_table)
- [created\_time](notion_types.BaseContentBlock.md#created_time)
- [file\_ids](notion_types.BaseContentBlock.md#file_ids)
- [format](notion_types.BaseContentBlock.md#format)
- [id](notion_types.BaseContentBlock.md#id)
- [last\_edited\_by\_id](notion_types.BaseContentBlock.md#last_edited_by_id)
- [last\_edited\_by\_table](notion_types.BaseContentBlock.md#last_edited_by_table)
- [last\_edited\_time](notion_types.BaseContentBlock.md#last_edited_time)
- [parent\_id](notion_types.BaseContentBlock.md#parent_id)
- [parent\_table](notion_types.BaseContentBlock.md#parent_table)
- [properties](notion_types.BaseContentBlock.md#properties)
- [space\_id](notion_types.BaseContentBlock.md#space_id)
- [type](notion_types.BaseContentBlock.md#type)
- [version](notion_types.BaseContentBlock.md#version)

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

### file\_ids

• `Optional` **file\_ids**: `string`[]

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

#### Overrides

[BaseBlock](notion_types.BaseBlock.md).[format](notion_types.BaseBlock.md#format)

#### Defined in

[packages/notion-types/src/block.ts:130](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L130)

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

• **properties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `caption?` | [`Decoration`](../modules/notion_types.md#decoration)[] |
| `source` | `string`[][] |

#### Overrides

[BaseBlock](notion_types.BaseBlock.md).[properties](notion_types.BaseBlock.md#properties)

#### Defined in

[packages/notion-types/src/block.ts:126](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/block.ts#L126)

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
