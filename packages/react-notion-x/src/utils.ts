export { formatDate, formatNotionDateTime } from 'notion-utils'

export const cs = (...classes: Array<string | undefined | false>) =>
  classes.filter((a) => !!a).join(' ')

export const getHashFragmentValue = (url: string) => {
  return url.includes('#') ? url.replace(/^.+(#.+)$/, '$1') : ''
}

export const isBrowser = !!globalThis.window

const youtubeDomains = new Set([
  'youtu.be',
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com'
])

export const getYoutubeId = (url: string): string | null => {
  try {
    const { hostname } = new URL(url)
    if (!youtubeDomains.has(hostname)) {
      return null
    }
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/i

    const match = url.match(regExp)
    if (match && match[2]?.length === 11) {
      return match[2]
    }
  } catch {
    // ignore invalid urls
  }

  return null
}

export const getUrlParams = (
  url: string
): Record<string, string> | undefined => {
  try {
    const { searchParams } = new URL(url)
    const result: Record<string, string> = {}
    for (const [key, value] of searchParams.entries()) {
      result[key] = value
    }

    return result
  } catch {
    // ignore invalid urls
  }

  return
}
