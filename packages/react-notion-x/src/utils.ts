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

/**
 * Get dates and month in an array of weeks based on the year and on the month
 * @param year
 * @param month
 * @param startWeekOnMonday
 * @returns An array of objects with month and date number
 */
export const getWeeksInMonth = (
  year: number,
  month: number,
  startWeekOnMonday?: boolean
) => {
  const weeks = [],
    firstDate = new Date(year, month, 1),
    lastDate = new Date(year, month + 1, 0),
    numDays = lastDate.getDate()

  let start = 1
  let end = -1

  if (firstDate.getDay() === 1) {
    end = 7
  } else if (firstDate.getDay() === 0) {
    const preMonthEndDay = new Date(year, month, 0)

    start = preMonthEndDay.getDate() - 6 + 1
    end = 1
  } else {
    const preMonthEndDay = new Date(year, month, 0)

    start =
      preMonthEndDay.getDate() +
      1 -
      firstDate.getDay() +
      (startWeekOnMonday ? 1 : 0)
    end = 7 - firstDate.getDay() + (startWeekOnMonday ? 1 : 0)

    weeks.push({
      start: start,
      end: end
    })

    start = end + 1
    end = end + 7
  }

  while (start <= numDays) {
    weeks.push({
      start: start,
      end: end
    })

    start = end + 1
    end += 7
    end = start === 1 && end === 8 ? 1 : end

    if (end > numDays && start <= numDays) {
      end = end - numDays

      weeks.push({
        start: start,
        end: end
      })

      break
    }
  }

  return weeks.map(({ start, end }, index) => {
    const sub = +(start > end && index === 0)
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(year, month - sub, start + index)

      return {
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      }
    })
  })
}
