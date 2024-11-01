import {
  type Block,
  type ExtendedRecordMap,
  type PageBlock
} from 'notion-types'

import { getBlockTitle } from './get-block-title'
import { getPageTableOfContents } from './get-page-table-of-contents'

type EstimatePageReadTimeOptions = {
  wordsPerMinute?: number
  imageReadTimeInSeconds?: number
}

type ContentStats = {
  numWords: number
  numImages: number
}

type PageReadTimeEstimate = ContentStats & {
  totalWordsReadTimeInMinutes: number
  totalImageReadTimeInMinutes: number
  totalReadTimeInMinutes: number
}

/**
 * Returns an estimate for the time it would take for a person to read the content
 * in the given Notion page.
 *
 * Uses Medium for inspiration.
 *
 * @see https://blog.medium.com/read-time-and-you-bc2048ab620c
 * @see https://github.com/ngryman/reading-time
 *
 * TODO: handle non-english content.
 */
export function estimatePageReadTime(
  block: Block,
  recordMap: ExtendedRecordMap,
  {
    wordsPerMinute = 275,
    imageReadTimeInSeconds = 12
  }: EstimatePageReadTimeOptions = {}
): PageReadTimeEstimate {
  const stats = getBlockContentStats(block, recordMap)
  const totalWordsReadTimeInMinutes = stats.numWords / wordsPerMinute
  const totalImageReadTimeInSeconds =
    stats.numImages > 10
      ? (stats.numImages / 2) * (imageReadTimeInSeconds + 3) +
        (stats.numImages - 10) * 3 // n/2(a+b) + 3 sec/image
      : (stats.numImages / 2) *
        (2 * imageReadTimeInSeconds + (1 - stats.numImages)) // n/2[2a+(n-1)d]
  const totalImageReadTimeInMinutes = totalImageReadTimeInSeconds / 60

  const totalReadTimeInMinutes =
    totalWordsReadTimeInMinutes + totalImageReadTimeInMinutes

  return {
    ...stats,
    totalWordsReadTimeInMinutes,
    totalImageReadTimeInMinutes,
    totalReadTimeInMinutes
  }
}

/**
 * Same as `estimatePageReadTime`, except it returns the total time estimate as
 * a human-readable string.
 *
 * For example, "9 minutes" or "less than a minute".
 */
export function estimatePageReadTimeAsHumanizedString(
  block: Block,
  recordMap: ExtendedRecordMap,
  opts: EstimatePageReadTimeOptions
) {
  const estimate = estimatePageReadTime(block, recordMap, opts)
  return humanizeReadTime(estimate.totalReadTimeInMinutes)
}

function getBlockContentStats(
  block: Block,
  recordMap: ExtendedRecordMap
): ContentStats {
  const stats: ContentStats = {
    numWords: 0,
    numImages: 0
  }

  if (!block) {
    return stats
  }

  for (const childId of block.content || []) {
    const child = recordMap.block[childId]?.value
    let recurse = false
    if (!child) continue

    switch (child.type) {
      case 'quote':
      // fallthrough
      case 'alias':
      // fallthrough
      case 'header':
      // fallthrough
      case 'sub_header':
      // fallthrough
      case 'sub_sub_header': {
        const title = getBlockTitle(child, recordMap)
        stats.numWords += countWordsInText(title)
        break
      }

      case 'callout':
      // fallthrough
      case 'toggle':
      // fallthrough
      case 'to_do':
      // fallthrough
      case 'bulleted_list':
      // fallthrough
      case 'numbered_list':
      // fallthrough
      case 'text': {
        const title = getBlockTitle(child, recordMap)
        stats.numWords += countWordsInText(title)
        recurse = true
        break
      }

      case 'embed':
      // fallthrough
      case 'tweet':
      // fallthrough
      case 'maps':
      // fallthrough
      case 'pdf':
      // fallthrough
      case 'figma':
      // fallthrough
      case 'typeform':
      // fallthrough
      case 'codepen':
      // fallthrough
      case 'excalidraw':
      // fallthrough
      case 'gist':
      // fallthrough
      case 'video':
      // fallthrough
      case 'drive':
      // fallthrough
      case 'audio':
      // fallthrough
      case 'file':
      // fallthrough
      case 'image':
        // treat all embeds as images
        stats.numImages += 1
        break

      case 'bookmark':
        // treat bookmarks as quarter images since they aren't as content-ful as embedd images
        stats.numImages += 0.25
        break

      case 'code':
        // treat code blocks as double the complexity of images
        stats.numImages += 2
        break

      case 'table':
      // fallthrough
      case 'collection_view':
        // treat collection views as double the complexity of images
        stats.numImages += 2
        break

      case 'column':
      // fallthrough
      case 'column_list':
      // fallthrough
      case 'transclusion_container':
        recurse = true
        break

      case 'table_of_contents': {
        const page = block as PageBlock
        if (!page) continue

        const toc = getPageTableOfContents(page, recordMap)
        for (const tocItem of toc) {
          stats.numWords += countWordsInText(tocItem.text)
        }

        break
      }

      case 'transclusion_reference': {
        const referencePointerId =
          child?.format?.transclusion_reference_pointer?.id

        if (!referencePointerId) {
          continue
        }
        const referenceBlock = recordMap.block[referencePointerId]?.value
        if (referenceBlock) {
          mergeContentStats(
            stats,
            getBlockContentStats(referenceBlock, recordMap)
          )
        }
        break
      }

      default:
        // ignore unrecognized blocks
        break
    }

    if (recurse) {
      mergeContentStats(stats, getBlockContentStats(child, recordMap))
    }
  }

  return stats
}

function mergeContentStats(statsA: ContentStats, statsB: ContentStats) {
  statsA.numWords += statsB.numWords
  statsA.numImages += statsB.numImages
}

function countWordsInText(text: string): number {
  if (!text) {
    return 0
  }

  return (text.match(/\w+/g) || []).length
}

function humanizeReadTime(time: number): string {
  if (time < 0.5) {
    return 'less than a minute'
  }

  if (time < 1.5) {
    return '1 minute'
  }

  return `${Math.ceil(time)} minutes`
}
