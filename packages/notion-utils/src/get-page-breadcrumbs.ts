import * as types from 'notion-types'
import { getBlockTitle } from './get-block-title'
import { getBlockIcon } from './get-block-icon'
import { getBlockParentPage } from './get-block-parent-page'

export const getPageBreadcrumbs = (
  recordMap: types.ExtendedRecordMap,
  activePageId: string
): Array<any> | null => {
  const blockMap = recordMap.block
  const breadcrumbs = []

  let currentPageId = activePageId

  do {
    const block = blockMap[currentPageId]?.value
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

    // eslint-disable-next-line no-constant-condition
  } while (true)

  breadcrumbs.reverse()

  return breadcrumbs
}
