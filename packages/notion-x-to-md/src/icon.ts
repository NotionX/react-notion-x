import {
  type Block,
  type CalloutBlock,
  type ExtendedRecordMap,
  type PageBlock
} from 'notion-types'
import { getBlockIcon, isUrl } from 'notion-utils'

const isIconBlock = (value: Block): value is PageBlock | CalloutBlock => {
  return (
    value.type === 'page' ||
    value.type === 'callout' ||
    value.type === 'collection_view' ||
    value.type === 'collection_view_page'
  )
}

export function getIcon(
  block: Block,
  recordMap: ExtendedRecordMap
): string | undefined {
  if (isIconBlock(block)) {
    const icon = getBlockIcon(block, recordMap)?.trim()

    if (!icon) {
      return '📁'
    }

    if (isUrl(icon) || icon.startsWith('/icons/')) {
      return '❔'
    }

    return icon
  }
}
