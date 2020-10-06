import * as React from 'react'
import {
  ExtendedRecordMap,
  MapPageUrl,
  MapImageUrl,
  NotionComponents
} from './types'
import { defaultMapPageUrl, defaultMapImageUrl } from './utils'

export interface NotionContext {
  recordMap: ExtendedRecordMap
  components: NotionComponents

  mapPageUrl: MapPageUrl
  mapImageUrl: MapImageUrl

  fullPage: boolean
  rootPageId?: string
  darkMode: boolean
  previewImages: boolean

  zoom: any
}

export interface PartialNotionContext {
  recordMap?: ExtendedRecordMap
  components?: Partial<NotionComponents>

  mapPageUrl?: MapPageUrl
  mapImageUrl?: MapImageUrl

  fullPage?: boolean
  rootPageId?: string
  darkMode?: boolean
  previewImages?: boolean

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

  fullPage: false,
  darkMode: false,
  previewImages: false,

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

export const useNotionContext = (): NotionContext => {
  return React.useContext(ctx)
}
