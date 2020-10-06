import React from 'react'
import mediumZoom from 'medium-zoom'
import {
  ExtendedRecordMap,
  MapPageUrl,
  MapImageUrl,
  NotionComponents
} from './types'
import { Block } from './block'
import { useNotionContext, NotionContextProvider } from './context'

export interface NotionRendererProps {
  recordMap: ExtendedRecordMap
  components?: Partial<NotionComponents>
  mapPageUrl?: MapPageUrl
  mapImageUrl?: MapImageUrl

  rootPageId?: string
  fullPage?: boolean
  darkMode?: boolean
  previewImages?: boolean

  className?: string
  bodyClassName?: string
  footer?: React.ReactNode

  blockId?: string
}

interface NotionBlockRendererProps {
  className?: string
  bodyClassName?: string
  footer?: React.ReactNode

  blockId?: string
  level?: number
  zoom?: any
}

export const NotionRenderer: React.FC<NotionRendererProps> = ({
  components,
  recordMap,
  mapPageUrl,
  mapImageUrl,
  fullPage,
  rootPageId,
  darkMode,
  previewImages,
  ...rest
}) => {
  const zoom =
    typeof window !== 'undefined' &&
    mediumZoom({
      container: '.notion',
      background: 'rgba(0, 0, 0, 0.8)',
      margin: getMediumZoomMargin()
    })

  return (
    <NotionContextProvider
      components={components}
      recordMap={recordMap}
      mapPageUrl={mapPageUrl}
      mapImageUrl={mapImageUrl}
      fullPage={fullPage}
      rootPageId={rootPageId}
      darkMode={darkMode}
      previewImages={previewImages}
      zoom={zoom}
    >
      <NotionBlockRenderer {...rest} />
    </NotionContextProvider>
  )
}

const NotionBlockRenderer: React.FC<NotionBlockRendererProps> = ({
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
