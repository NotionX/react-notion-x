import type { ExtendedRecordMap } from 'notion-types'

import { renderBlock } from './block'

export { renderBlock } from './block'
export { decorationsToMarkdown } from './text'

/**
 * Converts a Notion ExtendedRecordMap to a GitHub-Flavored Markdown string.
 *
 * The root block (first key in recordMap.block) is rendered as the top-level
 * page.
 *
 * This function has to be `async` because it may load remote resources like
 * tweets.
 */
export async function notionPageToMarkdown(
  recordMap: ExtendedRecordMap
): Promise<string> {
  const rootBlockId = Object.keys(recordMap.block)[0]
  if (!rootBlockId) return ''

  const markdown = await renderBlock(rootBlockId, recordMap)
  return markdown.trim()
}
