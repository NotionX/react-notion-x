import { type Block, type ExtendedRecordMap } from 'notion-types'

import { idToUuid } from './id-to-uuid'

export const notionImageProxyOrigin = 'https://app.notion.com'

const notionFileHosts = new Set(['file.notion.com', 'file.notion.so'])
const notionImageCdnHost = 'img.notionusercontent.com'
const minimumSignedUrlValidity = 60_000

export const isNotionHost = (hostname: string): boolean => {
  const normalizedHostname = hostname.toLowerCase()

  return (
    normalizedHostname === 'notion.so' ||
    normalizedHostname.endsWith('.notion.so') ||
    normalizedHostname === 'notion.com' ||
    normalizedHostname.endsWith('.notion.com')
  )
}

const getNotionImageProxySource = (url: URL): string | undefined => {
  if (!isNotionHost(url.hostname) || !url.pathname.startsWith('/image/')) {
    return undefined
  }

  try {
    return decodeURIComponent(url.pathname.slice('/image/'.length))
  } catch {
    return undefined
  }
}

const isLegacyNotionFileUrl = (url: URL): boolean => {
  const hostname = url.hostname.toLowerCase()

  return (
    hostname === 'secure.notion-static.com' ||
    hostname.startsWith('prod-files-secure.') ||
    (hostname.endsWith('.amazonaws.com') &&
      url.pathname.startsWith('/secure.notion-static.com/'))
  )
}

const getNotionImageCdnAttachmentSource = (url: URL): string | undefined => {
  if (url.hostname.toLowerCase() !== notionImageCdnHost) {
    return undefined
  }

  const match = /^\/s3\/([^/]+)\/size(?:\/|$)/.exec(url.pathname)
  if (!match) {
    return undefined
  }

  try {
    const [bucket, spaceId, fileId, ...filenameParts] = decodeURIComponent(
      match[1]!
    ).split('/')
    const filename = filenameParts.join('/')

    if (
      !bucket?.startsWith('prod-files-secure') ||
      !spaceId ||
      !fileId ||
      !filename
    ) {
      return undefined
    }

    return `attachment:${fileId}:${filename}`
  } catch {
    return undefined
  }
}

const hasNotionFileSignature = (url: URL): boolean =>
  (notionFileHosts.has(url.hostname.toLowerCase()) &&
    url.searchParams.has('signature')) ||
  (url.hostname.toLowerCase() === notionImageCdnHost &&
    (url.searchParams.has('sig') ||
      url.searchParams.has('signature') ||
      url.searchParams.has('tok'))) ||
  (isLegacyNotionFileUrl(url) &&
    (url.searchParams.has('X-Amz-Signature') ||
      url.searchParams.has('Signature')))

const isNotionSignedFileUrlImpl = (url: string, depth: number): boolean => {
  try {
    const parsedUrl = new URL(url)
    if (hasNotionFileSignature(parsedUrl)) {
      return true
    }

    const proxiedUrl = getNotionImageProxySource(parsedUrl)
    return Boolean(
      depth < 5 &&
      proxiedUrl &&
      proxiedUrl !== url &&
      isNotionSignedFileUrlImpl(proxiedUrl, depth + 1)
    )
  } catch {
    return false
  }
}

/** Returns whether a URL contains a temporary Notion file signature. */
export const isNotionSignedFileUrl = (url: string): boolean =>
  isNotionSignedFileUrlImpl(url, 0)

const getAwsSignatureExpiration = (url: URL): number | undefined => {
  const expires = Number(url.searchParams.get('X-Amz-Expires'))
  const date = url.searchParams.get('X-Amz-Date')
  const dateMatch = date?.match(
    /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/
  )

  if (!Number.isFinite(expires) || !dateMatch) {
    return undefined
  }

  const [, year, month, day, hour, minute, second] = dateMatch
  const startedAt = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  )

  const parsedDate = new Date(startedAt)
  if (
    parsedDate.getUTCFullYear() !== Number(year) ||
    parsedDate.getUTCMonth() !== Number(month) - 1 ||
    parsedDate.getUTCDate() !== Number(day) ||
    parsedDate.getUTCHours() !== Number(hour) ||
    parsedDate.getUTCMinutes() !== Number(minute) ||
    parsedDate.getUTCSeconds() !== Number(second)
  ) {
    return undefined
  }

  return startedAt + expires * 1000
}

const getNotionImageTokenExpiration = (url: URL): number | undefined => {
  if (url.hostname.toLowerCase() !== notionImageCdnHost) {
    return undefined
  }

  const payload = url.searchParams.get('tok')?.split('.')[1]
  if (!payload) {
    return undefined
  }

  try {
    const base64 = payload
      .replaceAll('-', '+')
      .replaceAll('_', '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=')
    const claims: unknown = JSON.parse(globalThis.atob(base64))
    if (!claims || typeof claims !== 'object') {
      return undefined
    }
    const expiration = Number((claims as { exp?: unknown }).exp)

    return Number.isFinite(expiration) && expiration > 0
      ? expiration * 1000
      : undefined
  } catch {
    return undefined
  }
}

const isNotionFileUrlExpiredImpl = (
  url: string,
  now: number,
  depth: number
): boolean => {
  try {
    const parsedUrl = new URL(url)
    let expirationTimestamp = Number(
      parsedUrl.searchParams.get('expirationTimestamp')
    )

    if (Number.isFinite(expirationTimestamp) && expirationTimestamp > 0) {
      if (expirationTimestamp < 1_000_000_000_000) {
        expirationTimestamp *= 1000
      }
      if (expirationTimestamp <= now) {
        return true
      }
    }

    const expires = Number(parsedUrl.searchParams.get('Expires'))
    if (Number.isFinite(expires) && expires > 0) {
      if (expires * 1000 <= now) {
        return true
      }
    }

    const exp = Number(parsedUrl.searchParams.get('exp'))
    if (Number.isFinite(exp) && exp > 0) {
      if (exp * 1000 <= now) {
        return true
      }
    }

    const tokenExpiration = getNotionImageTokenExpiration(parsedUrl)
    if (tokenExpiration !== undefined && tokenExpiration <= now) {
      return true
    }

    const awsExpiration = getAwsSignatureExpiration(parsedUrl)
    if (awsExpiration !== undefined && awsExpiration <= now) {
      return true
    }

    const proxiedUrl = getNotionImageProxySource(parsedUrl)
    return Boolean(
      depth < 5 &&
      proxiedUrl &&
      proxiedUrl !== url &&
      isNotionFileUrlExpiredImpl(proxiedUrl, now, depth + 1)
    )
  } catch {
    return false
  }
}

/** Returns whether a temporary Notion file URL carries an expired timestamp. */
export const isNotionFileUrlExpired = (
  url: string,
  now = Date.now()
): boolean => isNotionFileUrlExpiredImpl(url, now, 0)

const getAttachmentSource = (url: URL): string | undefined => {
  if (!notionFileHosts.has(url.hostname.toLowerCase())) {
    return undefined
  }

  // Current Notion file URLs are temporary resolved URLs. Recover the stable
  // attachment source so it can be resolved again when a cached signature dies.
  const match = /^\/f\/f\/[^/]+\/([^/]+)\/(.+)$/.exec(url.pathname)
  if (!match) {
    return undefined
  }

  try {
    return `attachment:${decodeURIComponent(match[1]!)}:${decodeURIComponent(
      match[2]!
    )}`
  } catch {
    return undefined
  }
}

/** Returns the underlying private Notion file URL without changing its form. */
export const getNotionFileUrl = (url: string): string | undefined => {
  if (url.startsWith('attachment:')) {
    return url
  }

  try {
    const parsedUrl = new URL(url)
    if (
      notionFileHosts.has(parsedUrl.hostname.toLowerCase()) ||
      isLegacyNotionFileUrl(parsedUrl)
    ) {
      return url
    }

    const proxiedUrl = getNotionImageProxySource(parsedUrl)
    if (proxiedUrl && proxiedUrl !== url) {
      return getNotionFileUrl(proxiedUrl)
    }
  } catch {
    return undefined
  }

  return undefined
}

/**
 * Returns a stable private Notion file source accepted by Notion's signing and
 * image proxy endpoints, including from legacy proxy and temporary file URLs.
 */
export const getStableNotionFileSource = (url: string): string | undefined => {
  if (url.startsWith('attachment:')) {
    return url
  }

  try {
    const parsedUrl = new URL(url)
    const attachmentSource = getAttachmentSource(parsedUrl)
    if (attachmentSource) {
      return attachmentSource
    }

    const imageCdnAttachmentSource =
      getNotionImageCdnAttachmentSource(parsedUrl)
    if (imageCdnAttachmentSource) {
      return imageCdnAttachmentSource
    }

    if (isLegacyNotionFileUrl(parsedUrl)) {
      parsedUrl.search = ''
      parsedUrl.hash = ''
      return parsedUrl.toString()
    }

    const proxiedUrl = getNotionImageProxySource(parsedUrl)
    if (proxiedUrl && proxiedUrl !== url) {
      return getStableNotionFileSource(proxiedUrl)
    }
  } catch {
    return undefined
  }

  return undefined
}

const getNotionImageUrl = (source: string, block: Block): string => {
  const notionImageUrl = new URL(
    `/image/${encodeURIComponent(source)}`,
    notionImageProxyOrigin
  )
  let table = block.parent_table === 'space' ? 'block' : block.parent_table
  if (table === 'collection' || table === 'team') {
    table = 'block'
  }

  const blockId = /^[0-9a-f]{32}$/i.test(block.id)
    ? idToUuid(block.id)
    : block.id

  notionImageUrl.searchParams.set('table', table)
  notionImageUrl.searchParams.set('id', blockId)
  notionImageUrl.searchParams.set('cache', 'v2')

  return notionImageUrl.toString()
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

  const rawNotionFileUrl = getNotionFileUrl(url)
  const stableNotionFileSource = getStableNotionFileSource(url)
  const signedUrl =
    signedUrls?.[url] ??
    signedUrls?.[rawNotionFileUrl ?? ''] ??
    signedUrls?.[stableNotionFileSource ?? '']
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

  let parsedUrl: URL | undefined
  try {
    parsedUrl = url.startsWith('/image/')
      ? new URL(url, notionImageProxyOrigin)
      : new URL(url)
  } catch {
    // Relative and attachment URLs are handled below.
  }

  if (
    parsedUrl &&
    isNotionHost(parsedUrl.hostname) &&
    (parsedUrl.pathname.startsWith('/images/') ||
      parsedUrl.pathname.startsWith('/icons/'))
  ) {
    const notionImageProxyUrl = new URL(notionImageProxyOrigin)
    parsedUrl.protocol = notionImageProxyUrl.protocol
    parsedUrl.host = notionImageProxyUrl.host
    return parsedUrl.toString()
  }

  const proxiedSource = parsedUrl
    ? getNotionImageProxySource(parsedUrl)
    : undefined
  const notionFileUrl = getStableNotionFileSource(proxiedSource ?? url)
  if (notionFileUrl) {
    return getNotionImageUrl(notionFileUrl, block)
  }

  // Re-home older Notion proxy URLs even when they wrap an external source.
  if (proxiedSource) {
    return getNotionImageUrl(proxiedSource, block)
  }

  if (
    parsedUrl &&
    (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:')
  ) {
    return url
  }

  if (url.startsWith('/images/') || url.startsWith('/icons/')) {
    return `${notionImageProxyOrigin}${url}`
  }

  return getNotionImageUrl(url, block)
}

/** Resolves the default image URL with the owning record map's access mode. */
export const resolveDefaultImageUrl = (
  url: string | undefined,
  block: Block,
  {
    signedUrls,
    isPublic
  }: {
    signedUrls: ExtendedRecordMap['signed_urls'] | undefined
    isPublic: boolean
  }
): string | undefined => {
  if (!isPublic) {
    const signedUrl = getSignedFileUrl(url, block, signedUrls)
    if (
      signedUrl &&
      isNotionSignedFileUrl(signedUrl) &&
      !isNotionFileUrlExpired(signedUrl, Date.now() + minimumSignedUrlValidity)
    ) {
      return signedUrl
    }
  }

  const mappedUrl = defaultMapImageUrl(url, block)

  // An opaque temporary CDN URL that cannot be converted back into a stable
  // source would reintroduce expiring output. Omit it instead.
  return mappedUrl && isNotionSignedFileUrl(mappedUrl) ? undefined : mappedUrl
}
