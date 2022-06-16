import * as React from 'react'
import mediumZoom from '@fisch0920/medium-zoom'
import { Block as BlockType, ExtendedRecordMap } from 'notion-types'

import {
  MapPageUrlFn,
  MapImageUrlFn,
  SearchNotionFn,
  NotionComponents
} from './types'
import { Block } from './block'
import { useNotionContext, NotionContextProvider } from './context'
import { cs } from './utils'

export const NotionRenderer: React.FC<{
  recordMap: ExtendedRecordMap
  components?: Partial<NotionComponents>

  mapPageUrl?: MapPageUrlFn
  mapImageUrl?: MapImageUrlFn
  searchNotion?: SearchNotionFn

  rootPageId?: string
  rootDomain?: string

  // set fullPage to false to render page content only
  // this will remove the header, cover image, and footer
  fullPage?: boolean

  darkMode?: boolean
  previewImages?: boolean
  forceCustomImages?: boolean
  showCollectionViewDropdown?: boolean
  linkTableTitleProperties?: boolean

  showTableOfContents?: boolean
  minTableOfContentsItems?: number

  defaultPageIcon?: string
  defaultPageCover?: string
  defaultPageCoverPosition?: number

  className?: string
  bodyClassName?: string

  header?: React.ReactNode
  footer?: React.ReactNode
  pageHeader?: React.ReactNode
  pageFooter?: React.ReactNode
  pageTitle?: React.ReactNode
  pageAside?: React.ReactNode
  pageCover?: React.ReactNode

  blockId?: string
  hideBlockId?: boolean
  disableHeader?: boolean
}> = ({
  components,
  recordMap,
  mapPageUrl,
  mapImageUrl,
  searchNotion,
  fullPage,
  rootPageId,
  rootDomain,
  darkMode,
  previewImages,
  forceCustomImages,
  showCollectionViewDropdown,
  linkTableTitleProperties,
  showTableOfContents,
  minTableOfContentsItems,
  defaultPageIcon,
  defaultPageCover,
  defaultPageCoverPosition,
  ...rest
}) => {
  const zoom = React.useMemo(
    () =>
      typeof window !== 'undefined' &&
      mediumZoom({
        background: 'rgba(0, 0, 0, 0.8)',
        minZoomScale: 2.0,
        margin: getMediumZoomMargin()
      }),
    []
  )

  return (
    <NotionContextProvider
      components={components}
      recordMap={recordMap}
      mapPageUrl={mapPageUrl}
      mapImageUrl={mapImageUrl}
      searchNotion={searchNotion}
      fullPage={fullPage}
      rootPageId={rootPageId}
      rootDomain={rootDomain}
      darkMode={darkMode}
      previewImages={previewImages}
      forceCustomImages={forceCustomImages}
      showCollectionViewDropdown={showCollectionViewDropdown}
      linkTableTitleProperties={linkTableTitleProperties}
      showTableOfContents={showTableOfContents}
      minTableOfContentsItems={minTableOfContentsItems}
      defaultPageIcon={defaultPageIcon}
      defaultPageCover={defaultPageCover}
      defaultPageCoverPosition={defaultPageCoverPosition}
      zoom={zoom}
    >
      <NotionBlockRenderer {...rest} />
    </NotionContextProvider>
  )
}

export const NotionBlockRenderer: React.FC<{
  className?: string
  bodyClassName?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  disableHeader?: boolean

  blockId?: string
  hideBlockId?: boolean
  level?: number
}> = ({ level = 0, blockId, ...props }) => {
  const { recordMap } = useNotionContext()
  const id = blockId || Object.keys(recordMap.block)[0]
  const block = recordMap.block[id]?.value

  if (!block) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('missing block', blockId)
    }

    return null
  }

  return (
    <Block key={id} level={level} block={block} {...props}>
      <BlockChildrenRenderer level={level} block={block} {...props} />
    </Block>
  )
}

const BlockChildrenRenderer: React.FC<{
  className?: string
  bodyClassName?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  disableHeader?: boolean

  block: BlockType
  hideBlockId?: boolean
  level?: number
}> = ({ level, block, ...props }) => {
  const { recordMap } = useNotionContext()
  const contentNodes = []

  if (!block.content) {
    return <></>
  }

  const wrapList = (content: React.ReactElement[]) =>
    block.type === 'bulleted_list' ? (
      <ul className={cs('notion-list', 'notion-list-disc')}>{content}</ul>
    ) : (
      <ol className={cs('notion-list', 'notion-list-numbered')}>{content}</ol>
    )

  for (let i = 0; i < block.content.length; ) {
    const nextChildBlock = recordMap.block[block.content[i]]?.value
    const nextChildBlockType = nextChildBlock?.type

    let nextChildGroup = [block.content[i]]
    if (
      nextChildBlockType === 'bulleted_list' ||
      nextChildBlockType === 'numbered_list'
    ) {
      let j = i
      while (
        j < block.content.length &&
        recordMap.block[block.content[j]]?.value?.type === nextChildBlockType
      ) {
        j++
      }
      nextChildGroup = block.content.slice(i, j)
    }

    const nextRenderedGroup = nextChildGroup.map((nextChildId) => (
      <NotionBlockRenderer
        key={nextChildId}
        blockId={nextChildId}
        level={level + 1}
        {...props}
      />
    ))

    if (
      nextChildBlockType === 'bulleted_list' ||
      nextChildBlockType === 'numbered_list'
    ) {
      contentNodes.push(wrapList(nextRenderedGroup))
    } else {
      contentNodes.push(...nextRenderedGroup)
    }

    i += nextChildGroup.length
  }

  return <>{contentNodes}</>
}

function getMediumZoomMargin() {
  const width = window.innerWidth

  if (width < 500) {
    return 8
  } else if (width < 800) {
    return 20
  } else if (width < 1280) {
    return 30
  } else if (width < 1600) {
    return 40
  } else if (width < 1920) {
    return 48
  } else {
    return 72
  }
}
