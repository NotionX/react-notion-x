[Docs](../README.md) / [notion-types](../modules/notion_types.md) / CollectionQueryResult

# Interface: CollectionQueryResult

[notion-types](../modules/notion_types.md).CollectionQueryResult

## Table of contents

### Properties

- [aggregationResults](notion_types.CollectionQueryResult.md#aggregationresults)
- [blockIds](notion_types.CollectionQueryResult.md#blockids)
- [collection\_group\_results](notion_types.CollectionQueryResult.md#collection_group_results)
- [groupResults](notion_types.CollectionQueryResult.md#groupresults)
- [total](notion_types.CollectionQueryResult.md#total)
- [type](notion_types.CollectionQueryResult.md#type-1)

## Properties

### aggregationResults

• **aggregationResults**: [`AggregationResult`](notion_types.AggregationResult.md)[]

#### Defined in

[packages/notion-types/src/maps.ts:76](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L76)

___

### blockIds

• **blockIds**: `string`[]

#### Defined in

[packages/notion-types/src/maps.ts:75](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L75)

___

### collection\_group\_results

• `Optional` **collection\_group\_results**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `blockIds` | `string`[] |
| `hasMore` | `boolean` |
| `type` | `string` |

#### Defined in

[packages/notion-types/src/maps.ts:86](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L86)

___

### groupResults

• `Optional` **groupResults**: { `aggregationResult`: [`AggregationResult`](notion_types.AggregationResult.md) ; `blockIds`: `string`[] ; `total`: `number` ; `value`: [`AggregationResult`](notion_types.AggregationResult.md)  }[]

#### Defined in

[packages/notion-types/src/maps.ts:79](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L79)

___

### total

• **total**: `number`

#### Defined in

[packages/notion-types/src/maps.ts:73](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L73)

___

### type

• **type**: [`CollectionViewType`](../modules/notion_types.md#collectionviewtype)

#### Defined in

[packages/notion-types/src/maps.ts:72](https://github.com/ntcho/react-notion-x/blob/dbcf322/packages/notion-types/src/maps.ts#L72)
