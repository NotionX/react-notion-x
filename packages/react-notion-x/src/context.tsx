import React from 'react'
import { ExtendedRecordMap } from 'notion-types'
import { Text } from "../src/components/text";

import {
  MapPageUrl,
  MapImageUrl,
  SearchNotion,
  NotionComponents
} from './types'
import { defaultMapPageUrl, defaultMapImageUrl } from './utils'
import { Checkbox as DefaultCheckbox } from './components/checkbox'
import { LazyImage } from './components/lazy-image'

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
  customImages: boolean
  showCollectionViewDropdown: boolean
  showTableOfContents: boolean
  minTableOfContentsItems: number

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
  customImages?: boolean
  showCollectionViewDropdown?: boolean

  showTableOfContents?: boolean
  minTableOfContentsItems?: number

  defaultPageIcon?: string
  defaultPageCover?: string
  defaultPageCoverPosition?: number

  zoom?: any
}

const DefaultImage: React.FC = (props) => (
  <LazyImage {...props} />
)
const DefaultLink: React.FC = (props) => (
  <a target='_blank' rel='noopener noreferrer' {...props} />
)
const DefaultPageLink: React.FC = (props) => <a {...props} />

export const dummyLink = ({ href, rel, target, title, ...rest }) => (
  <span {...rest} />
)

const dummyComponent = (name: string) => () => {
  console.warn(
    `Error using empty component: ${name}\nYou should override this in NotionRenderer.components`
  )

  return null
}

const defaultComponents: NotionComponents = {
  image: DefaultImage,
  link: DefaultLink,
  pageLink: DefaultPageLink,
  checkbox: DefaultCheckbox,
  text: Text,

  code: dummyComponent('code'),
  equation: dummyComponent('equation'),

  collection: dummyComponent('collection'),
  collectionRow: dummyComponent('collectionRow'),

  pdf: dummyComponent('pdf'),
  tweet: dummyComponent('tweet'),
  modal: dummyComponent('modal')
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
  customImages: false,
  showCollectionViewDropdown: true,

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

  return (
    <ctx.Provider
      value={{
        ...defaultNotionContext,
        ...rest,
        rootPageId,
        mapPageUrl: mapPageUrl ?? defaultMapPageUrl(rootPageId),
        mapImageUrl: mapImageUrl ?? defaultMapImageUrl,
        components: { ...defaultComponents, ...themeComponents }
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
