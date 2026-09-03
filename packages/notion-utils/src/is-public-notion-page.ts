import { type ExtendedRecordMap, type PageBlock } from 'notion-types'

import { getBlockValue } from './get-block-value'
import { idToUuid } from './id-to-uuid'

const getBlock = (recordMap: ExtendedRecordMap, blockId?: string) => {
  if (!blockId) return undefined

  const normalizedBlockId = /^[0-9a-f]{32}$/i.test(blockId)
    ? idToUuid(blockId)
    : blockId.replaceAll('-', '')

  return getBlockValue(
    recordMap.block[blockId] ?? recordMap.block[normalizedBlockId]
  )
}

const getPublicAccess = (
  recordMap: ExtendedRecordMap,
  blockId?: string
): boolean | undefined => {
  let block = getBlock(recordMap, blockId)
  const visitedBlockIds = new Set<string>()
  let foundExplicitPermissions = false

  while (block && !visitedBlockIds.has(block.id)) {
    visitedBlockIds.add(block.id)

    const permissions = (block as PageBlock | undefined)?.permissions
    if (permissions) {
      foundExplicitPermissions = true
      if (permissions.some(({ type }) => type === 'public_permission')) {
        return true
      }
    }

    block = getBlock(recordMap, block.parent_id)
  }

  if (foundExplicitPermissions) {
    return false
  }

  return undefined
}

/** Returns whether the root page is reachable through a public permission. */
export const isPublicNotionPage = (
  recordMap: ExtendedRecordMap,
  rootPageId?: string
): boolean => {
  const blockIds = Object.keys(recordMap.block)
  const resolvedRootPageId = getBlock(recordMap, rootPageId)?.id ?? blockIds[0]
  const publicAccess = getPublicAccess(recordMap, resolvedRootPageId)

  if (publicAccess !== undefined) {
    return publicAccess
  }

  // Some collection rows omit their parent chain. Only fall back to the rest
  // of the map when the requested chain contained no permission evidence.
  return blockIds.some((blockId) =>
    (getBlock(recordMap, blockId) as PageBlock | undefined)?.permissions?.some(
      ({ type }) => type === 'public_permission'
    )
  )
}

/** Returns whether an image-owning block inherits public page access. */
export const isPublicNotionBlock = (
  recordMap: ExtendedRecordMap,
  blockId: string,
  rootPageId?: string
): boolean =>
  getPublicAccess(recordMap, blockId) ??
  isPublicNotionPage(recordMap, rootPageId)
