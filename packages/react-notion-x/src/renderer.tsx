import React from 'react'
import mediumZoom from 'medium-zoom'
import { ExtendedRecordMap } from 'notion-types'

import {
  MapPageUrl,
  MapImageUrl,
  SearchNotion,
  NotionComponents
} from './types'
import { Block } from './block'
import { useNotionContext, NotionContextProvider } from './context'

export interface NotionRendererProps {
  recordMap: ExtendedRecordMap
  components?: Partial<NotionComponents>

  mapPageUrl?: MapPageUrl
  mapImageUrl?: MapImageUrl
  searchNotion?: SearchNotion

  rootPageId?: string
  fullPage?: boolean
  darkMode?: boolean
  previewImages?: boolean
  showCollectionViewDropdown?: boolean

  showTableOfContents?: boolean
  minTableOfContentsItems?: number

  defaultPageIcon?: string
  defaultPageCover?: string
  defaultPageCoverPosition?: number

  className?: string
  bodyClassName?: string

  footer?: React.ReactNode
  pageHeader?: React.ReactNode
  pageFooter?: React.ReactNode
  pageAside?: React.ReactNode
  pageCover?: React.ReactNode

  blockId?: string
  hideBlockId?: boolean
}

interface NotionBlockRendererProps {
  className?: string
  bodyClassName?: string
  footer?: React.ReactNode

  blockId?: string
  hideBlockId?: boolean
  level?: number
  zoom?: any
}

export const NotionRenderer: React.FC<NotionRendererProps> = ({
  components,
  recordMap,
  mapPageUrl,
  mapImageUrl,
  searchNotion,
  fullPage,
  rootPageId,
  darkMode,
  previewImages,
  showCollectionViewDropdown,
  showTableOfContents,
  minTableOfContentsItems,
  defaultPageIcon,
  defaultPageCover,
  defaultPageCoverPosition,
  ...rest
}) => {
  const zoom =
    typeof window !== 'undefined' &&
    mediumZoom({
      container: '.notion-viewport',
      background: 'rgba(0, 0, 0, 0.8)',
      margin: getMediumZoomMargin()
    })

  return (
    <NotionContextProvider
      components={components}
      recordMap={recordMap}
      mapPageUrl={mapPageUrl}
      mapImageUrl={mapImageUrl}
      searchNotion={searchNotion}
      fullPage={fullPage}
      rootPageId={rootPageId}
      darkMode={darkMode}
      previewImages={previewImages}
      showCollectionViewDropdown={showCollectionViewDropdown}
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

export const NotionBlockRenderer: React.FC<NotionBlockRendererProps> = ({
  level = 0,
  blockId,
  ...props
}) => {
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
      {block?.content?.map((contentBlockId) => (
        <NotionBlockRenderer
          key={contentBlockId}
          blockId={contentBlockId}
          level={level + 1}
          {...props}
        />
      ))}
    </Block>
  )
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
