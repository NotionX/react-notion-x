import * as types from 'notion-types'

/**
 * Gets the raw, unformatted text content of a block's content value.
 *
 * This is useful, for instance, for extracting a block's `title` without any
 * rich text formatting.
 */
export const getTextContent = (text?: types.Decoration[]): string => {
  return text?.reduce((prev, current) => prev + current[0], '') ?? ''
}
