import { type BlockMap } from 'notion-types'
import { getBlockValue } from 'notion-utils'

export { formatDate, formatNotionDateTime, isUrl } from 'notion-utils'

export const cs = (...classes: Array<string | undefined | false>) =>
  classes.filter((a) => !!a).join(' ')

const groupBlockContent = (blockMap: BlockMap): string[][] => {
  const output: string[][] = []

  let lastType: string | undefined
  let index = -1

  for (const id of Object.keys(blockMap)) {
    const blockValue = getBlockValue(blockMap[id])

    if (blockValue) {
      if (blockValue.content)
        for (const blockId of blockValue.content) {
          const blockType = getBlockValue(blockMap[blockId])?.type

          if (blockType && blockType !== lastType) {
            index++
            lastType = blockType
            output[index] = []
          }

          if (index > -1) {
            output[index]?.push(blockId)
          }
        }
    }

    lastType = undefined
  }

  return output
}

export const getListNumber = (blockId: string, blockMap: BlockMap) => {
  const groups = groupBlockContent(blockMap)
  const group = groups.find((g) => g.includes(blockId))

  if (!group) {
    return
  }

  const groupIndex = group.indexOf(blockId) + 1
  const startIndex = getBlockValue(blockMap[blockId])?.format?.list_start_index
  return getBlockValue(blockMap[blockId])?.type === 'numbered_list'
    ? (startIndex ?? groupIndex)
    : groupIndex
}

export const getListNestingLevel = (
  blockId: string,
  blockMap: BlockMap
): number => {
  let level = 0
  let currentBlockId = blockId

  while (true) {
    const parentId = getBlockValue(blockMap[currentBlockId])?.parent_id

    if (!parentId) break

    const parentBlock = getBlockValue(blockMap[parentId])
    if (!parentBlock) break

    if (parentBlock.type === 'numbered_list') {
      level++
      currentBlockId = parentId
    } else {
      break
    }
  }

  return level
}

export const getListStyle = (level: number): string => {
  const styles: string[] = ['decimal', 'lower-alpha', 'lower-roman']
  const index = ((level % styles.length) + styles.length) % styles.length
  return styles[index] as string
}

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

export const setUrlParams = (
  urlString: string,
  params: Record<string, string>
): string => {
  const url = new URL(urlString)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url.toString()
}

export const deleteUrlParams = (urlString: string, keys: string[]): string => {
  const url = new URL(urlString)
  for (const key of keys) {
    url.searchParams.delete(key)
  }
  return url.toString()
}
