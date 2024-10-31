import type * as types from 'notion-types'

/**
 * Attempts to find a valid date from a given property.
 */
export const getDateValue = (prop: any[]): types.FormattedDate | null => {
  if (prop && Array.isArray(prop)) {
    if (prop[0] === 'd') {
      return prop[1] as types.FormattedDate
    } else {
      for (const v of prop) {
        const value = getDateValue(v as any[])
        if (value) {
          return value
        }
      }
    }
  }

  return null
}
