import type * as types from 'notion-types'

import { getBlockIcon } from './get-block-icon'
import { getBlockParentPage } from './get-block-parent-page'
import { getBlockTitle } from './get-block-title'
import { getBlockValue } from './get-block-value'

export const getPageBreadcrumbs = (
  recordMap: types.ExtendedRecordMap,
  activePageId: string
): Array<any> | null => {
  const blockMap = recordMap.block
  const breadcrumbs = []

  let currentPageId = activePageId

  do {
    const block = getBlockValue(blockMap[currentPageId])
    if (!block) {
      break
    }

    const title = getBlockTitle(block, recordMap)
    const icon = getBlockIcon(block, recordMap)

    if (!(title || icon)) {
      break
    }

    breadcrumbs.push({
      block,
      active: currentPageId === activePageId,
      pageId: currentPageId,
      title,
      icon
    })

    const parentBlock = getBlockParentPage(block, recordMap)
    const parentId = parentBlock?.id

    if (!parentId) {
      break
    }

    currentPageId = parentId
  } while (true)

  breadcrumbs.reverse()

  return breadcrumbs
}
