import { Block, BlockMap } from 'notion-types'
import isUrl from 'is-url-superb'

export const cs = (...classes: Array<string | undefined | false>) =>
  classes.filter((a) => !!a).join(' ')

export { isUrl }

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

export const defaultMapImageUrl = (url: string, block: Block) => {
  if (!url) {
    return null
  }

  if (url.startsWith('data:')) {
    return url
  }

  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`
  }

  // more recent versions of notion don't proxy unsplash images
  if (!url.startsWith('https://images.unsplash.com')) {
    url = `https://www.notion.so${
      url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
    }`

    const notionImageUrlV2 = new URL(url)
    let table = block.parent_table === 'space' ? 'block' : block.parent_table
    if (table === 'collection') {
      table = 'block'
    }
    notionImageUrlV2.searchParams.set('table', table)
    notionImageUrlV2.searchParams.set('id', block.id)
    notionImageUrlV2.searchParams.set('cache', 'v2')

    url = notionImageUrlV2.toString()
  }

  return url
}

export const defaultMapPageUrl = (rootPageId?: string) => (pageId: string) => {
  pageId = (pageId || '').replace(/-/g, '')

  if (rootPageId && pageId === rootPageId) {
    return '/'
  } else {
    return `/${pageId}`
  }
}

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export const formatDate = (input: string) => {
  const date = new Date(input)
  const month = date.getMonth()
  return `${months[month]} ${date.getDate()}, ${date.getFullYear()}`
}

export const isBrowser = typeof window !== 'undefined';
