import type { ExtendedRecordMap } from 'notion-types'
import { getBlockValue } from 'notion-utils'

import { renderBlock } from './block'
import { decodeEquation } from './equation'

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
  recordMap: ExtendedRecordMap,
  { decodeEscapedMath = false }: { decodeEscapedMath?: boolean } = {}
): Promise<string> {
  // Escaped TeX cannot be distinguished reliably from valid matrix row breaks.
  // Opt in per page, preserving the default and the caller's original records.
  if (decodeEscapedMath) {
    recordMap = structuredClone(recordMap)
    for (const record of Object.values(recordMap.block)) {
      const block = getBlockValue(record)
      for (const run of block?.properties?.title ?? []) {
        if (block?.type === 'equation') {
          run[0] = decodeEquation(run[0])
        } else {
          for (const format of run[1] ?? []) {
            if (format[0] === 'e') format[1] = decodeEquation(format[1])
          }
        }
      }
    }
  }

  const rootBlockId = Object.keys(recordMap.block)[0]
  if (!rootBlockId) return ''

  const markdown = await renderBlock(rootBlockId, recordMap)
  return markdown.trim()
}
