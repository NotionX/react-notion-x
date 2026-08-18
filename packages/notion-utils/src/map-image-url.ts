import { type Block, type ExtendedRecordMap } from 'notion-types'

const notionOrigin = 'https://www.notion.so'

const isLegacyNotionFileUrl = (url: URL): boolean => {
  const hostname = url.hostname.toLowerCase()

  return (
    hostname === 'secure.notion-static.com' ||
    hostname.startsWith('prod-files-secure.') ||
    (hostname.endsWith('.amazonaws.com') &&
      url.pathname.startsWith('/secure.notion-static.com/'))
  )
}

const isSignedS3Url = (url: URL): boolean =>
  url.searchParams.has('X-Amz-Credential') &&
  url.searchParams.has('X-Amz-Signature')

/** Returns the underlying private Notion file URL, including from legacy proxy URLs. */
export const getNotionFileUrl = (url: string): string | undefined => {
  if (url.startsWith('attachment:')) {
    return url
  }

  try {
    const parsedUrl = new URL(url)
    const hostname = parsedUrl.hostname.toLowerCase()

    if (
      hostname === 'file.notion.com' ||
      hostname === 'file.notion.so' ||
      isLegacyNotionFileUrl(parsedUrl)
    ) {
      return url
    }

    if (
      (hostname === 'notion.so' ||
        hostname.endsWith('.notion.so') ||
        hostname === 'notion.com' ||
        hostname.endsWith('.notion.com')) &&
      parsedUrl.pathname.startsWith('/image/')
    ) {
      const proxiedUrl = decodeURIComponent(
        parsedUrl.pathname.slice('/image/'.length)
      )

      if (proxiedUrl !== url) {
        return getNotionFileUrl(proxiedUrl)
      }
    }
  } catch {
    return undefined
  }

  return undefined
}

/**
 * Resolves a private Notion file URL using signatures added by `notion-client`.
 *
 * New record maps store signatures by original URL so blocks with multiple assets
 * (for example, a page cover and icon) resolve unambiguously. The block ID lookup
 * keeps older record maps compatible.
 */
export const getSignedFileUrl = (
  url: string | undefined,
  block: Block,
  signedUrls: ExtendedRecordMap['signed_urls'] | undefined
): string | undefined => {
  if (!url) {
    return undefined
  }

  const notionFileUrl = getNotionFileUrl(url)
  const signedUrl = signedUrls?.[url] ?? signedUrls?.[notionFileUrl ?? '']
  if (signedUrl) {
    return signedUrl
  }

  const primaryUrl =
    block.type === 'page'
      ? block.format?.page_cover
      : block.properties?.source?.[0]?.[0]

  if (url === primaryUrl) {
    return signedUrls?.[block.id] ?? url
  }

  return url
}

export const defaultMapImageUrl = (
  url: string | undefined,
  block: Block
): string | undefined => {
  if (!url) {
    return undefined
  }

  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }

  try {
    const parsedUrl = new URL(url)

    // Absolute URLs are already usable as-is. The only exception is Notion's
    // legacy private S3 storage, which requires either a signature or the legacy
    // image proxy below.
    if (
      (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
      (!isLegacyNotionFileUrl(parsedUrl) || isSignedS3Url(parsedUrl))
    ) {
      return url
    }
  } catch {
    // Relative and attachment URLs are handled below.
  }

  if (url.startsWith('/images/') || url.startsWith('/icons/')) {
    return `${notionOrigin}${url}`
  }

  url = `${notionOrigin}${
    url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
  }`

  const notionImageUrlV2 = new URL(url)
  let table = block.parent_table === 'space' ? 'block' : block.parent_table
  if (table === 'collection' || table === 'team') {
    table = 'block'
  }
  notionImageUrlV2.searchParams.set('table', table)
  notionImageUrlV2.searchParams.set('id', block.id)
  notionImageUrlV2.searchParams.set('cache', 'v2')

  url = notionImageUrlV2.toString()

  return url
}
