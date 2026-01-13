import type * as notion from 'notion-types'

import type * as types from './types'
import { convertRichText } from './convert-rich-text'

/**
 * Converts Notion API page properties to unofficial API format
 * Handles all property types from database pages
 */
export function convertPageProperties(
  properties: types.Page['properties']
): Record<string, notion.Decoration[]> {
  const result: Record<string, notion.Decoration[]> = {}

  for (const [key, value] of Object.entries(properties)) {
    if (!value || typeof value !== 'object') continue

    const propertyValue = value as any

    switch (propertyValue.type) {
      case 'title':
        if (propertyValue.title) {
          result[key] = convertRichText(propertyValue.title)
        }
        break

      case 'rich_text':
        if (propertyValue.rich_text) {
          result[key] = convertRichText(propertyValue.rich_text)
        }
        break

      case 'number':
        if (
          propertyValue.number !== null &&
          propertyValue.number !== undefined
        ) {
          result[key] = [[String(propertyValue.number)]]
        }
        break

      case 'select':
        if (propertyValue.select?.name) {
          result[key] = [[propertyValue.select.name]]
        }
        break

      case 'multi_select':
        if (propertyValue.multi_select?.length) {
          result[key] = [
            propertyValue.multi_select.map((item: any) => item.name)
          ]
        }
        break

      case 'status':
        if (propertyValue.status?.name) {
          result[key] = [[propertyValue.status.name]]
        }
        break

      case 'date':
        if (propertyValue.date) {
          const dateValue = propertyValue.date.end
            ? `${propertyValue.date.start} → ${propertyValue.date.end}`
            : propertyValue.date.start
          result[key] = [[dateValue]]
        }
        break

      case 'checkbox':
        result[key] = [[propertyValue.checkbox ? 'Yes' : 'No']]
        break

      case 'url':
        if (propertyValue.url) {
          result[key] = [[propertyValue.url]]
        }
        break

      case 'email':
        if (propertyValue.email) {
          result[key] = [[propertyValue.email]]
        }
        break

      case 'phone_number':
        if (propertyValue.phone_number) {
          result[key] = [[propertyValue.phone_number]]
        }
        break

      case 'people':
        if (propertyValue.people?.length) {
          result[key] = [propertyValue.people.map((person: any) => person.id)]
        }
        break

      case 'files':
        if (propertyValue.files?.length) {
          result[key] = propertyValue.files
            .map((file: any) => {
              const url =
                file.type === 'external' ? file.external?.url : file.file?.url
              return url ? [url] : []
            })
            .filter((item: any) => item.length > 0)
        }
        break

      case 'relation':
        if (propertyValue.relation?.length) {
          result[key] = [propertyValue.relation.map((rel: any) => rel.id)]
        }
        break

      case 'formula':
        if (propertyValue.formula) {
          const formula = propertyValue.formula
          switch (formula.type) {
            case 'string':
              if (formula.string) {
                result[key] = [[formula.string]]
              }
              break
            case 'number':
              if (formula.number !== null && formula.number !== undefined) {
                result[key] = [[String(formula.number)]]
              }
              break
            case 'boolean':
              result[key] = [[formula.boolean ? 'Yes' : 'No']]
              break
            case 'date':
              if (formula.date) {
                const dateValue = formula.date.end
                  ? `${formula.date.start} → ${formula.date.end}`
                  : formula.date.start
                result[key] = [[dateValue]]
              }
              break
          }
        }
        break

      case 'rollup':
        if (propertyValue.rollup) {
          const rollup = propertyValue.rollup
          switch (rollup.type) {
            case 'number':
              if (rollup.number !== null && rollup.number !== undefined) {
                result[key] = [[String(rollup.number)]]
              }
              break
            case 'date':
              if (rollup.date) {
                const dateValue = rollup.date.end
                  ? `${rollup.date.start} → ${rollup.date.end}`
                  : rollup.date.start
                result[key] = [[dateValue]]
              }
              break
            case 'array':
              if (rollup.array?.length) {
                result[key] = rollup.array
                  .map((item: any) => {
                    if (typeof item === 'string') return [item]
                    if (typeof item === 'number') return [String(item)]
                    return []
                  })
                  .filter((item: any) => item.length > 0)
              }
              break
          }
        }
        break

      case 'created_time':
        if (propertyValue.created_time) {
          result[key] = [[propertyValue.created_time]]
        }
        break

      case 'created_by':
        if (propertyValue.created_by?.id) {
          result[key] = [[propertyValue.created_by.id]]
        }
        break

      case 'last_edited_time':
        if (propertyValue.last_edited_time) {
          result[key] = [[propertyValue.last_edited_time]]
        }
        break

      case 'last_edited_by':
        if (propertyValue.last_edited_by?.id) {
          result[key] = [[propertyValue.last_edited_by.id]]
        }
        break

      case 'unique_id':
        if (propertyValue.unique_id) {
          const uniqueId = propertyValue.unique_id.prefix
            ? `${propertyValue.unique_id.prefix}-${propertyValue.unique_id.number}`
            : String(propertyValue.unique_id.number)
          result[key] = [[uniqueId]]
        }
        break

      case 'verification':
        if (propertyValue.verification) {
          const status = propertyValue.verification.state || 'unverified'
          result[key] = [[status]]
        }
        break
    }
  }

  return result
}
