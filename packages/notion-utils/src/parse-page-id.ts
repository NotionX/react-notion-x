import { idToUuid } from './id-to-uuid'

const pageIdRe = /\b([a-f0-9]{32})\b/
const pageId2Re = /\b([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\b/

/**
 * Robustly extracts the notion page ID from a notion URL or pathname suffix.
 *
 * Defaults to returning a UUID (with dashes).
 */
export const parsePageId = (
  id: string | null = '',
  { uuid = true }: { uuid?: boolean } = {}
) => {
  if (!id) {
    return null
  }

  id = id.split('?')[0]
  const match = id.match(pageIdRe)

  if (match) {
    return uuid ? idToUuid(match[1]) : match[1]
  }

  const match2 = id.match(pageId2Re)
  if (match2) {
    return uuid ? match2[1] : match2[1].replace(/-/g, '')
  }

  return null
}
