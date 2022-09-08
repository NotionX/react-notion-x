import { BlockMap } from 'notion-types'

export { isUrl, formatDate, formatNotionDateTime } from 'notion-utils'
export * from './map-image-url'
export * from './map-page-url'

export const cs = (...classes: Array<string | undefined | false>) =>
  classes.filter((a) => !!a).join(' ')

const groupBlockContent = (blockMap: BlockMap): string[][] => {
  const output: string[][] = []

  let lastType: string | undefined = undefined
  let index = -1

  Object.keys(blockMap).forEach((id) => {
    const blockValue = blockMap[id]?.value

    if (blockValue) {
      blockValue.content?.forEach((blockId) => {
        const blockType = blockMap[blockId]?.value?.type

        if (blockType && blockType !== lastType) {
          index++
          lastType = blockType
          output[index] = []
        }

        if (index > -1) {
          output[index].push(blockId)
        }
      })
    }

    lastType = undefined
  })

  return output
}

export const getListNumber = (blockId: string, blockMap: BlockMap) => {
  const groups = groupBlockContent(blockMap)
  const group = groups.find((g) => g.includes(blockId))

  if (!group) {
    return
  }

  return group.indexOf(blockId) + 1
}

export const getHashFragmentValue = (url: string) => {
  return url.includes('#') ? url.replace(/^.+(#.+)$/, '$1') : ''
}

export const isBrowser = typeof window !== 'undefined'

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
    if (match && match[2].length == 11) {
      return match[2]
    }
  } catch {
    // ignore invalid urls
  }

  return null
}

export const getWeeksInMonth = (year: number, month: number) => {
  const weeks = []

  const firstDate = new Date(year, month, 1)
  const lastDate = new Date(year, month + 1, 0)
  const numDays = lastDate.getDate()
  let dayOfWeekCounter = firstDate.getDay()

  for (let date = 1; date <= numDays; date++) {
    if (dayOfWeekCounter === 0 || weeks.length === 0) {
      weeks.push([])
    }
    weeks[weeks.length - 1].push(date)
    dayOfWeekCounter = (dayOfWeekCounter + 1) % 7
  }

  // This is to add the last week of the previous month to the first week of the current month.
  if (weeks[0].length < 7) {
    const beforeIndex1 = addMonth(year, month - 1, 1)
    const indexRefactor = [...beforeIndex1, ...weeks[0]]
    weeks[0] = indexRefactor
  }

  // This is to add the first week of the next month to the last week of the current month
  if (weeks[weeks.length - 1].length < 7) {
    const afterIndex1 = addMonth(year, month + 1, 0)
    const indexRefactor = [...weeks[weeks.length - 1], ...afterIndex1]
    weeks[weeks.length - 1] = indexRefactor
  }

  return weeks
    .filter((w) => !!w.length)
    .map((w) => ({
      start: w[0],
      end: w[w.length - 1],
      dates: w
    }))
}

const addMonth = (year: number, month: number, flag: 0 | 1) => {
  const weeks = []
  const firstDate = new Date(year, month, 1)
  const lastDate = new Date(year, month + 1, 0)
  const numDays = lastDate.getDate()
  let dayOfWeekCounter = firstDate.getDay()

  for (let date = 1; date <= numDays; date++) {
    if (dayOfWeekCounter === 0 || weeks.length === 0) {
      weeks.push([])
    }
    weeks[weeks.length - 1].push(date)
    dayOfWeekCounter = (dayOfWeekCounter + 1) % 7
  }
  if (flag == 0) {
    return weeks[0]
  } else if (flag == 1) {
    return weeks[weeks.length - 1]
  }

  return []
}
