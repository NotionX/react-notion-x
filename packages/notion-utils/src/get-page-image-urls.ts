import type * as types from 'notion-types'

import { getBlockIcon } from './get-block-icon'
import { getBlockValue } from './get-block-value'
import { isPublicNotionBlock } from './is-public-notion-page'
import { isUrl } from './is-url'
import { defaultMapImageUrl, resolveDefaultImageUrl } from './map-image-url'

/**
 * Gets URLs of all images contained on the given page.
 */
export const getPageImageUrls = (
  recordMap: types.ExtendedRecordMap,
  {
    mapImageUrl
  }: {
    mapImageUrl: (url: string, block: types.Block) => string | undefined
  }
): string[] => {
  const blockIds = Object.keys(recordMap.block)
  const imageUrls: string[] = blockIds
    .flatMap((blockId) => {
      const block = getBlockValue(recordMap.block[blockId])
      const images: Array<{ block: types.Block; url: string }> = []

      if (block) {
        if (block.type === 'image') {
          const source = block.properties?.source?.[0]?.[0]

          if (source) {
            images.push({
              block,
              url: source
            })
          }
        }

        if ((block.format as any)?.page_cover) {
          const source = (block.format as any).page_cover

          images.push({
            block,
            url: source
          })
        }

        if ((block.format as any)?.bookmark_cover) {
          const source = (block.format as any).bookmark_cover

          images.push({
            block,
            url: source
          })
        }

        if ((block.format as any)?.bookmark_icon) {
          const source = (block.format as any).bookmark_icon

          images.push({
            block,
            url: source
          })
        }

        const pageIcon = getBlockIcon(block, recordMap)
        if (pageIcon && isUrl(pageIcon)) {
          images.push({
            block,
            url: pageIcon
          })
        }
      }

      return images
    })
    .filter(Boolean)
    .map(({ block, url }) => {
      const resolvedUrl = resolveDefaultImageUrl(url, block, {
        isPublic: isPublicNotionBlock(recordMap, block.id),
        signedUrls: recordMap.signed_urls
      })

      if (mapImageUrl === defaultMapImageUrl) {
        return resolvedUrl
      }

      return resolvedUrl ? mapImageUrl(resolvedUrl, block) : undefined
    })
    .filter(Boolean)

  return Array.from(new Set(imageUrls))
}
