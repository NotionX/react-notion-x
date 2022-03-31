import React from 'react'
import { ExtendedRecordMap } from 'notion-types'
import { wrapNextImage, wrapNextLink } from './next'
import { AssetWrapper } from './components/asset-wrapper'

import {
  MapPageUrl,
  MapImageUrl,
  SearchNotion,
  NotionComponents
} from './types'
import { defaultMapPageUrl, defaultMapImageUrl } from './utils'
import { Checkbox as DefaultCheckbox } from './components/checkbox'

export interface NotionContext {
  recordMap: ExtendedRecordMap
  components: NotionComponents

  mapPageUrl: MapPageUrl
  mapImageUrl: MapImageUrl
  searchNotion?: SearchNotion

  rootPageId?: string
  rootDomain?: string

  fullPage: boolean
  darkMode: boolean
  previewImages: boolean
  forceCustomImages: boolean
  showCollectionViewDropdown: boolean
  showTableOfContents: boolean
  minTableOfContentsItems: number
  linkTableTitleProperties: boolean

  defaultPageIcon?: string
  defaultPageCover?: string
  defaultPageCoverPosition?: number

  zoom: any
}

export interface PartialNotionContext {
  recordMap?: ExtendedRecordMap
  components?: Partial<NotionComponents>

  mapPageUrl?: MapPageUrl
  mapImageUrl?: MapImageUrl
  searchNotion?: SearchNotion

  rootPageId?: string
  rootDomain?: string

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

  zoom?: any
}

const DefaultLink: React.FC = (props) => (
  <a target='_blank' rel='noopener noreferrer' {...props} />
)
const DefaultPageLink: React.FC = (props) => <a {...props} />

const DefaultEmbed = AssetWrapper

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dummyLink = ({ href, rel, target, title, ...rest }) => (
  <span {...rest} />
)

const dummyComponent = (name: string) => () => {
  console.warn(
    `Warning: using empty component "${name}" (you should override this in NotionRenderer.components)`
  )

  return null
}

const defaultComponents: NotionComponents = {
  Image: null, // disable custom images by default
  Link: DefaultLink,
  PageLink: DefaultPageLink,
  Checkbox: DefaultCheckbox,

  Code: dummyComponent('Code'),
  Equation: dummyComponent('Equation'),

  Collection: dummyComponent('Collection'),

  Pdf: dummyComponent('Pdf'),
  Tweet: dummyComponent('Tweet'),
  Modal: dummyComponent('Modal'),

  Embed: DefaultEmbed
}

const defaultNotionContext: NotionContext = {
  recordMap: {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {}
  },

  components: defaultComponents,

  mapPageUrl: defaultMapPageUrl(),
  mapImageUrl: defaultMapImageUrl,
  searchNotion: null,

  fullPage: false,
  darkMode: false,
  previewImages: false,
  forceCustomImages: false,
  showCollectionViewDropdown: true,
  linkTableTitleProperties: true,

  showTableOfContents: false,
  minTableOfContentsItems: 3,

  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  zoom: null
}

const ctx = React.createContext<NotionContext>(defaultNotionContext)

export const NotionContextProvider: React.SFC<PartialNotionContext> = ({
  components: themeComponents = {},
  children,
  mapPageUrl,
  mapImageUrl,
  rootPageId,
  ...rest
}) => {
  for (const key of Object.keys(rest)) {
    if (rest[key] === undefined) {
      delete rest[key]
    }
  }

  const wrappedThemeComponents = {
    ...themeComponents
  }

  if (wrappedThemeComponents.nextImage) {
    wrappedThemeComponents.Image = wrapNextImage(themeComponents.nextImage)
  }

  if (wrappedThemeComponents.nextLink) {
    wrappedThemeComponents.nextLink = wrapNextLink(themeComponents.nextLink)
  }

  // ensure the user can't override default components with falsy values
  // since it would result in very difficult-to-debug react errors
  for (const key of Object.keys(wrappedThemeComponents)) {
    if (!wrappedThemeComponents[key]) {
      delete wrappedThemeComponents[key]
    }
  }

  return (
    <ctx.Provider
      value={{
        ...defaultNotionContext,
        ...rest,
        rootPageId,
        mapPageUrl: mapPageUrl ?? defaultMapPageUrl(rootPageId),
        mapImageUrl: mapImageUrl ?? defaultMapImageUrl,
        components: { ...defaultComponents, ...wrappedThemeComponents }
      }}
    >
      {children}
    </ctx.Provider>
  )
}

export const NotionContextConsumer = ctx.Consumer

export const useNotionContext = (): NotionContext => {
  return React.useContext(ctx)
}
