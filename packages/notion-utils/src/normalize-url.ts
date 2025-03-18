import memoize from 'memoize'
import normalizeUrlImpl from 'normalize-url'

export const normalizeUrl = memoize((url?: string) => {
  if (!url) {
    return ''
  }

  try {
    if (url.startsWith('https://www.notion.so/image/')) {
      const u = new URL(url)
      const subUrl = decodeURIComponent(u.pathname.slice('/image/'.length))
      const normalizedSubUrl = normalizeUrl(subUrl)
      u.pathname = `/image/${encodeURIComponent(normalizedSubUrl)}`
      url = u.toString()
    }

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
