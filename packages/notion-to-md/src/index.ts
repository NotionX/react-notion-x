import type { ExtendedRecordMap } from 'notion-types'

import { renderBlock } from './block'

export { renderBlock } from './block'
export { decorationsToMarkdown } from './text'

/**
 * Converts a Notion ExtendedRecordMap to a GitHub-Flavored Markdown string.
 *
 * The root block (first key in recordMap.block) is rendered as the top-level
 * page. Collections are skipped in this first iteration.
 */
export function notionPageToMarkdown(recordMap: ExtendedRecordMap): string {
  const rootBlockId = Object.keys(recordMap.block)[0]
  if (!rootBlockId) return ''
  return renderBlock(rootBlockId, recordMap).trim()
}
