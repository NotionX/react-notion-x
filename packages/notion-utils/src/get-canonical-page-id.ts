import { ExtendedRecordMap } from 'notion-types'
import { uuidToId } from './uuid-to-id'
import { getBlockTitle } from './get-block-title'
import { getPageProperty } from './get-page-property'
import { normalizeTitle } from './normalize-title'

/**
 * Gets the canonical, display-friendly version of a page's ID for use in URLs.
 */
export const getCanonicalPageId = (
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null => {
  if (!pageId || !recordMap) return null

  const id = uuidToId(pageId)
  const block = recordMap.block[pageId]?.value

  if (block) {
    const slug =
      (getPageProperty('slug', block, recordMap) as string | null) ||
      (getPageProperty('Slug', block, recordMap) as string | null) ||
      normalizeTitle(getBlockTitle(block, recordMap))

    if (slug) {
      if (uuid) {
        return `${slug}-${id}`
      } else {
        return slug
      }
    }
  }

  return id
}
