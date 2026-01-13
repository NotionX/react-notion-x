import type * as notion from 'notion-types'

import type * as types from './types'
import { convertRichText } from './convert-rich-text'

/**
 * Converts a Notion API database to unofficial API collection format
 */
export function convertCollection(database: types.Database): notion.Collection {
  const collection: notion.Collection = {
    id: database.id,
    version: 1,
    name: database.title ? convertRichText(database.title as any) : [['']],
    schema: {},
    icon: '',
    parent_id: '',
    parent_table: 'block',
    alive: !database.archived,
    copied_from: ''
  }

  // Set icon
  if (database.icon) {
    switch (database.icon.type) {
      case 'emoji':
        collection.icon = database.icon.emoji
        break
      case 'external':
        collection.icon = database.icon.external.url
        break
      case 'file':
        collection.icon = (database.icon as any).file?.url || ''
        break
    }
  }

  // Set parent
  if (database.parent) {
    switch (database.parent.type) {
      case 'page_id':
        collection.parent_id = database.parent.page_id
        collection.parent_table = 'block'
        break
      case 'workspace':
        collection.parent_table = 'space'
        break
    }
  }

  // Convert database properties to collection schema
  if (database.properties) {
    for (const [propertyId, property] of Object.entries(database.properties)) {
      const schema: notion.CollectionPropertySchema = {
        name: property.name || '',
        type: convertPropertyType(property.type)
      }

      // Add property-specific configuration
      switch (property.type) {
        case 'number':
          if ((property as any).number) {
            schema.number_format = (property as any).number.format || 'number'
          }
          break

        case 'select':
          if ((property as any).select?.options) {
            schema.options = (property as any).select.options.map(
              (opt: any) => ({
                id: opt.id,
                color: opt.color,
                value: opt.name
              })
            )
          }
          break

        case 'multi_select':
          if ((property as any).multi_select?.options) {
            schema.options = (property as any).multi_select.options.map(
              (opt: any) => ({
                id: opt.id,
                color: opt.color,
                value: opt.name
              })
            )
          }
          break

        case 'status':
          if ((property as any).status?.options) {
            schema.options = (property as any).status.options.map(
              (opt: any) => ({
                id: opt.id,
                color: opt.color,
                value: opt.name
              })
            )
          }
          break

        case 'formula':
          if ((property as any).formula) {
            schema.formula = {
              type: 'formula',
              name: property.name || '',
              formula: (property as any).formula.expression || ''
            } as any
          }
          break
      }

      collection.schema[propertyId] = schema
    }
  }

  return collection
}

/**
 * Maps Notion API property types to unofficial API property types
 */
function convertPropertyType(type: string): notion.PropertyType {
  const typeMap: Record<string, notion.PropertyType> = {
    title: 'title',
    rich_text: 'text',
    number: 'number',
    select: 'select',
    multi_select: 'multi_select',
    status: 'select', // Status is similar to select
    date: 'date',
    people: 'person',
    files: 'file',
    checkbox: 'checkbox',
    url: 'url',
    email: 'email',
    phone_number: 'phone_number',
    formula: 'formula',
    relation: 'relation',
    rollup: 'number', // Rollup results vary, default to number
    created_time: 'created_time',
    created_by: 'created_by',
    last_edited_time: 'last_edited_time',
    last_edited_by: 'last_edited_by',
    unique_id: 'text',
    verification: 'text'
  }

  return typeMap[type] || ('text' as notion.PropertyType)
}
