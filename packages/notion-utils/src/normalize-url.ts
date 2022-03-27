import normalizeUrlImpl from 'normalize-url'
import mem from 'mem'

export const normalizeUrl = mem((url?: string) => {
  if (!url) {
    return ''
  }

  try {
    if (url.startsWith('https://www.notion.so/image/')) {
      const u = new URL(url)
      const subUrl = decodeURIComponent(u.pathname.substr('/image/'.length))
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
  } catch (err) {
    return ''
  }
})
