[Docs](../README.md) / [notion-types](../modules/notion_types.md) / ExtendedRecordMap

# Interface: ExtendedRecordMap

[notion-types](../modules/notion_types.md).ExtendedRecordMap

## Hierarchy

- [`RecordMap`](notion_types.RecordMap.md)

  ↳ **`ExtendedRecordMap`**

## Table of contents

### Properties

- [block](notion_types.ExtendedRecordMap.md#block)
- [collection](notion_types.ExtendedRecordMap.md#collection)
- [collection\_query](notion_types.ExtendedRecordMap.md#collection_query)
- [collection\_view](notion_types.ExtendedRecordMap.md#collection_view)
- [notion\_user](notion_types.ExtendedRecordMap.md#notion_user)
- [preview\_images](notion_types.ExtendedRecordMap.md#preview_images)
- [signed\_urls](notion_types.ExtendedRecordMap.md#signed_urls)

## Properties

### block

• **block**: [`BlockMap`](../modules/notion_types.md#blockmap)

#### Inherited from

[RecordMap](notion_types.RecordMap.md).[block](notion_types.RecordMap.md#block)

#### Defined in

[packages/notion-types/src/maps.ts:30](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L30)

___

### collection

• **collection**: [`CollectionMap`](../modules/notion_types.md#collectionmap)

#### Overrides

[RecordMap](notion_types.RecordMap.md).[collection](notion_types.RecordMap.md#collection)

#### Defined in

[packages/notion-types/src/maps.ts:39](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L39)

___

### collection\_query

• **collection\_query**: `Object`

#### Index signature

▪ [collectionId: `string`]: { `[collectionViewId: string]`: [`CollectionQueryResult`](notion_types.CollectionQueryResult.md);  }

#### Defined in

[packages/notion-types/src/maps.ts:44](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L44)

___

### collection\_view

• **collection\_view**: [`CollectionViewMap`](../modules/notion_types.md#collectionviewmap)

#### Overrides

[RecordMap](notion_types.RecordMap.md).[collection_view](notion_types.RecordMap.md#collection_view)

#### Defined in

[packages/notion-types/src/maps.ts:40](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L40)

___

### notion\_user

• **notion\_user**: [`UserMap`](../modules/notion_types.md#usermap)

#### Overrides

[RecordMap](notion_types.RecordMap.md).[notion_user](notion_types.RecordMap.md#notion_user)

#### Defined in

[packages/notion-types/src/maps.ts:41](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L41)

___

### preview\_images

• `Optional` **preview\_images**: [`PreviewImageMap`](notion_types.PreviewImageMap.md)

#### Defined in

[packages/notion-types/src/maps.ts:56](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L56)

___

### signed\_urls

• **signed\_urls**: `Object`

#### Index signature

▪ [blockId: `string`]: `string`

#### Defined in

[packages/notion-types/src/maps.ts:51](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L51)
