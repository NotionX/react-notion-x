import { idToUuid } from './id-to-uuid'

const pageIdRe = /\b([\da-f]{32})\b/

// TODO
// eslint-disable-next-line security/detect-unsafe-regex
const pageId2Re = /\b([\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12})\b/

/**
 * Robustly extracts the notion page ID from a notion URL or pathname suffix.
 *
 * Defaults to returning a UUID (with dashes).
 */
export const parsePageId = (
  id: string | undefined | null = '',
  { uuid = true }: { uuid?: boolean } = {}
): string | undefined => {
  if (!id) return

  id = id.split('?')[0]!
  if (!id) return

  const match = id.match(pageIdRe)

  if (match) {
    return uuid ? idToUuid(match[1]) : match[1]
  }

  const match2 = id.match(pageId2Re)
  if (match2) {
    return uuid ? match2[1] : match2[1]!.replaceAll('-', '')
  }

  return
}
