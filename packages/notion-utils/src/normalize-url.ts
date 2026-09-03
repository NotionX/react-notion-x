import memoize from 'memoize'
import normalizeUrlImpl from 'normalize-url'

import { notionImageProxyOrigin } from './map-image-url'

export const normalizeUrl = memoize((url?: string) => {
  if (!url) {
    return ''
  }

  try {
    const u = new URL(url)
    const hostname = u.hostname.toLowerCase()
    const isNotionImageProxy =
      (hostname === 'notion.so' ||
        hostname.endsWith('.notion.so') ||
        hostname === 'notion.com' ||
        hostname.endsWith('.notion.com')) &&
      u.pathname.startsWith('/image/')

    if (isNotionImageProxy) {
      const subUrl = decodeURIComponent(u.pathname.slice('/image/'.length))
      const normalizedSubUrl = normalizeUrl(subUrl)
      const notionImageProxyUrl = new URL(notionImageProxyOrigin)
      u.protocol = notionImageProxyUrl.protocol
      u.host = notionImageProxyUrl.host
      u.pathname = `/image/${encodeURIComponent(normalizedSubUrl)}`
      url = u.toString()
    }
  } catch {
    // Protocol-relative and protocol-less URLs are normalized below.
  }

  try {
    return normalizeUrlImpl(url, {
      stripProtocol: true,
      stripWWW: true,
      stripHash: true,
      stripTextFragment: true,
      removeQueryParameters: true
    })
  } catch {
    return ''
  }
})
