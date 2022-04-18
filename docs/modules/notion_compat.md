[Docs](../README.md) / notion-compat

# Module: notion-compat

## Table of contents

### Classes

- [NotionCompatAPI](../classes/notion_compat.NotionCompatAPI.md)

### Functions

- [convertBlock](notion_compat.md#convertblock)
- [convertRichText](notion_compat.md#convertrichtext)
- [convertRichTextItem](notion_compat.md#convertrichtextitem)
- [convertTime](notion_compat.md#converttime)

## Functions

### convertBlock

▸ **convertBlock**(`__namedParameters`): `notion.Block`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.block` | `GetBlockResponse` |
| `__namedParameters.blockMap?` | `BlockMap` |
| `__namedParameters.children?` | `string`[] |
| `__namedParameters.pageMap?` | `PageMap` |
| `__namedParameters.parentMap?` | `ParentMap` |

#### Returns

`notion.Block`

#### Defined in

[packages/notion-compat/src/convert-block.ts:8](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-compat/src/convert-block.ts#L8)

___

### convertRichText

▸ **convertRichText**(`richText`): `notion.Decoration`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `richText` | `RichTextItemResponse`[] |

#### Returns

`notion.Decoration`[]

#### Defined in

[packages/notion-compat/src/convert-rich-text.ts:6](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-compat/src/convert-rich-text.ts#L6)

___

### convertRichTextItem

▸ **convertRichTextItem**(`richTextItem`): `notion.Decoration`

#### Parameters

| Name | Type |
| :------ | :------ |
| `richTextItem` | `RichTextItemResponse` |

#### Returns

`notion.Decoration`

#### Defined in

[packages/notion-compat/src/convert-rich-text.ts:10](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-compat/src/convert-rich-text.ts#L10)

___

### convertTime

▸ **convertTime**(`time?`): `number` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `time?` | `string` |

#### Returns

`number` \| `undefined`

#### Defined in

[packages/notion-compat/src/convert-time.ts:1](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-compat/src/convert-time.ts#L1)
