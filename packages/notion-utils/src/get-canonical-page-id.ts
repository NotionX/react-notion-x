import { ExtendedRecordMap } from 'notion-types'
import { uuidToId } from './uuid-to-id'
import { getBlockTitle } from './get-block-title'

/**
 * Gets the canonical, display-friendly version of a page's ID for use in URLs.
 */
export const getCanonicalPageId = (
  pageId: string,
  recordMap: ExtendedRecordMap
): string | null => {
  if (!pageId || !recordMap) return null

  const id = uuidToId(pageId)
  const block = recordMap.block[pageId]?.value

  if (block) {
    const title = normalizeTitle(getBlockTitle(block, recordMap))

    if (title) {
      return `${title}-${id}`
    }
  }

  return id
}

export const normalizeTitle = (title: string | null): string => {
  return (title || '')
    .replace(/ /g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/--/g, '-')
    .replace(/-$/, '')
    .replace(/^-/, '')
    .trim()
    .toLowerCase()
}
