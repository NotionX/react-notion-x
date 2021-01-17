import * as React from 'react'
import {
  ExtendedRecordMap,
  MapPageUrl,
  MapImageUrl,
  SearchNotion,
  NotionComponents
} from './types'
import { defaultMapPageUrl, defaultMapImageUrl } from './utils'

export interface NotionContext {
  recordMap: ExtendedRecordMap
  components: NotionComponents

  mapPageUrl: MapPageUrl
  mapImageUrl: MapImageUrl
  searchNotion?: SearchNotion

  rootPageId?: string

  fullPage: boolean
  darkMode: boolean
  previewImages: boolean
  showCollectionViewDropdown: boolean

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

  fullPage?: boolean
  darkMode?: boolean
  previewImages?: boolean
  showCollectionViewDropdown?: boolean

  defaultPageIcon?: string
  defaultPageCover?: string
  defaultPageCoverPosition?: number

  zoom?: any
}

const DefaultLink: React.SFC = (props) => (
  <a target='_blank' rel='noopener noreferrer' {...props} />
)
const DefaultPageLink: React.SFC = (props) => <a {...props} />

export const dummyLink = ({ href, rel, target, title, ...rest }) => (
  <span {...rest} />
)

const defaultComponents: NotionComponents = {
  link: DefaultLink,
  pageLink: DefaultPageLink
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
  showCollectionViewDropdown: true,

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
