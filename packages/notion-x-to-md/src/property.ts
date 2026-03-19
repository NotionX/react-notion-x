import type {
  Block,
  Collection,
  CollectionPropertySchema,
  Decoration,
  ExtendedRecordMap
} from 'notion-types'
import { format } from 'date-fns/format'
import formatNumber from 'format-number'

import { evalFormula } from './eval-formula'
import { decorationsToMarkdown } from './text'

export function renderCollectionProperty(
  schema: CollectionPropertySchema,
  data: Decoration[],
  rowBlock: Block,
  recordMap: ExtendedRecordMap,
  collection?: Collection
): string {
  switch (schema.type) {
    case 'number':
      return renderCollectionNumberProperty(schema, data, recordMap)

    case 'created_time':
      return rowBlock.created_time
        ? format(new Date(rowBlock.created_time), 'MMM d, yyyy hh:mm aa')
        : ''

    case 'last_edited_time':
      return rowBlock.last_edited_time
        ? format(new Date(rowBlock.last_edited_time), 'MMM d, yyyy hh:mm aa')
        : ''

    case 'checkbox': {
      const isChecked = data?.[0]?.[0] === 'Yes'
      return isChecked ? '✓' : '✗'
    }

    case 'email': {
      const email = data?.[0]?.[0]
      if (!email) return ''
      return `[${email}](mailto:${email})`
    }

    case 'phone_number': {
      const phone = data?.[0]?.[0]
      if (!phone) return ''
      return `[${phone}](tel:${phone})`
    }

    case 'formula':
      if (!schema.formula) return ''
      try {
        const result = evalFormula(schema.formula, {
          schema: collection?.schema,
          properties: rowBlock.properties ?? {}
        })
        if (result instanceof Date) {
          return format(result, 'MMM d, yyyy hh:mm aa')
        }
        if (result === null || result === undefined) return ''
        return String(result)
      } catch {
        return ''
      }

    case 'status':
      return data?.[0]?.[0] || ''

    case 'select':
    case 'multi_select': {
      const originalValues = (data?.[0]?.[0] || '').split(',')
      const values = originalValues.filter((value) =>
        schema.options?.some((option) => value === option.value)
      )
      return values.join(', ')
    }

    // these all might need custom handling in the future
    case 'person':
      // console.log('person', JSON.stringify(data, null, 2))
      return decorationsToMarkdown(data, recordMap)

    // case 'date':
    // case 'file':
    // case 'relation':
    default:
      return decorationsToMarkdown(data, recordMap)
  }
}

function renderCollectionNumberProperty(
  schema: CollectionPropertySchema,
  data: Decoration[],
  recordMap: ExtendedRecordMap
): string {
  if (!data?.length || !data[0]?.[0]) return ''
  const value = Number.parseFloat(data[0][0] as string)
  if (Number.isNaN(value)) return decorationsToMarkdown(data, recordMap)

  switch ((schema as any).number_format) {
    case 'number_with_commas':
      return formatNumber()(value)
    case 'percent':
      return formatNumber({ suffix: '%' })(value * 100)
    case 'dollar':
      return formatNumber({ prefix: '$', round: 2, padRight: 2 })(value)
    case 'euro':
      return formatNumber({ prefix: '€', round: 2, padRight: 2 })(value)
    case 'pound':
      return formatNumber({ prefix: '£', round: 2, padRight: 2 })(value)
    case 'yen':
      return formatNumber({ prefix: '¥', round: 0 })(value)
    case 'rupee':
      return formatNumber({ prefix: '₹', round: 2, padRight: 2 })(value)
    case 'won':
      return formatNumber({ prefix: '₩', round: 0 })(value)
    case 'yuan':
      return formatNumber({ prefix: 'CN¥', round: 2, padRight: 2 })(value)
    case 'argentine_peso':
      return formatNumber({ prefix: 'ARS ', round: 2, padRight: 2 })(value)
    case 'baht':
      return formatNumber({ prefix: 'THB ', round: 2, padRight: 2 })(value)
    case 'canadian_dollar':
      return formatNumber({ prefix: 'CA$', round: 2, padRight: 2 })(value)
    case 'chilean_peso':
      return formatNumber({ prefix: 'CLP ', round: 0 })(value)
    case 'colombian_peso':
      return formatNumber({ prefix: 'COP ', round: 0 })(value)
    case 'danish_krone':
      return formatNumber({ prefix: 'DKK ', round: 2, padRight: 2 })(value)
    case 'dirham':
      return formatNumber({ prefix: 'AED ', round: 2, padRight: 2 })(value)
    case 'forint':
      return formatNumber({ prefix: 'HUF ', round: 0 })(value)
    case 'franc':
      return formatNumber({ prefix: 'CHF ', round: 2, padRight: 2 })(value)
    case 'hong_kong_dollar':
      return formatNumber({ prefix: 'HK$', round: 2, padRight: 2 })(value)
    case 'koruna':
      return formatNumber({ prefix: 'CZK ', round: 2, padRight: 2 })(value)
    case 'krona':
      return formatNumber({ prefix: 'SEK ', round: 2, padRight: 2 })(value)
    case 'leu':
      return formatNumber({ prefix: 'RON ', round: 2, padRight: 2 })(value)
    case 'lira':
      return formatNumber({ prefix: 'TRY ', round: 2, padRight: 2 })(value)
    case 'mexican_peso':
      return formatNumber({ prefix: 'MX$', round: 2, padRight: 2 })(value)
    case 'new_taiwan_dollar':
      return formatNumber({ prefix: 'NT$', round: 0 })(value)
    case 'new_zealand_dollar':
      return formatNumber({ prefix: 'NZ$', round: 2, padRight: 2 })(value)
    case 'norwegian_krone':
      return formatNumber({ prefix: 'NOK ', round: 2, padRight: 2 })(value)
    case 'number':
      return formatNumber()(value)
    case 'philippine_peso':
      return formatNumber({ prefix: '₱', round: 2, padRight: 2 })(value)
    case 'peruvian_sol':
      return formatNumber({ prefix: 'PEN ', round: 2, padRight: 2 })(value)
    case 'rand':
      return formatNumber({ prefix: 'ZAR ', round: 2, padRight: 2 })(value)
    case 'real':
      return formatNumber({ prefix: 'R$', round: 2, padRight: 2 })(value)
    case 'ringgit':
      return formatNumber({ prefix: 'MYR ', round: 2, padRight: 2 })(value)
    case 'riyal':
      return formatNumber({ prefix: 'SAR ', round: 2, padRight: 2 })(value)
    case 'ruble':
      return formatNumber({ prefix: 'RUB ', round: 2, padRight: 2 })(value)
    case 'rupiah':
      return formatNumber({ prefix: 'IDR ', round: 0 })(value)
    case 'shekel':
      return formatNumber({ prefix: '₪', round: 2, padRight: 2 })(value)
    case 'singapore_dollar':
      return formatNumber({ prefix: 'SGD ', round: 2, padRight: 2 })(value)
    case 'uruguayan_peso':
      return formatNumber({ prefix: 'UYU ', round: 2, padRight: 2 })(value)
    case 'zloty':
      return formatNumber({ prefix: 'PLN ', round: 2, padRight: 2 })(value)
    default:
      return decorationsToMarkdown(data, recordMap)
  }
}
