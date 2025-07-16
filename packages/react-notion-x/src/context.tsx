import { type ExtendedRecordMap } from 'notion-types'
import { defaultMapImageUrl, defaultMapPageUrl } from 'notion-utils'
import * as React from 'react'

import { AssetWrapper } from './components/asset-wrapper'
import { Checkbox as DefaultCheckbox } from './components/checkbox'
import { Header } from './components/header'
import { wrapNextImage, wrapNextLegacyImage, wrapNextLink } from './next'
import {
  type MapImageUrlFn,
  type MapPageUrlFn,
  type NotionComponents,
  type SearchNotionFn
} from './types'

export interface NotionContext {
  recordMap: ExtendedRecordMap
  components: NotionComponents

  mapPageUrl: MapPageUrlFn
  mapImageUrl: MapImageUrlFn
  searchNotion?: SearchNotionFn
  isShowingSearch?: boolean
  onHideSearch?: () => void

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
  isLinkCollectionToUrlProperty: boolean

  defaultPageIcon?: string | null
  defaultPageCover?: string | null
  defaultPageCoverPosition?: number

  zoom: any
}

export interface PartialNotionContext {
  recordMap?: ExtendedRecordMap
  components?: Partial<NotionComponents>

  mapPageUrl?: MapPageUrlFn
  mapImageUrl?: MapImageUrlFn
  searchNotion?: SearchNotionFn
  isShowingSearch?: boolean
  onHideSearch?: () => void

  rootPageId?: string
  rootDomain?: string

  fullPage?: boolean
  darkMode?: boolean
  previewImages?: boolean
  forceCustomImages?: boolean
  showCollectionViewDropdown?: boolean
  linkTableTitleProperties?: boolean
  isLinkCollectionToUrlProperty?: boolean

  showTableOfContents?: boolean
  minTableOfContentsItems?: number

  defaultPageIcon?: string | null
  defaultPageCover?: string | null
  defaultPageCoverPosition?: number

  zoom?: any
}

function DefaultLink(props: any) {
  return <a target='_blank' rel='noopener noreferrer' {...props} />
}
const DefaultLinkMemo = React.memo(DefaultLink)
function DefaultPageLink(props: any) {
  return <a {...props} />
}
const DefaultPageLinkMemo = React.memo(DefaultPageLink)

function DefaultEmbed(props: any) {
  return <AssetWrapper {...props} />
}
const DefaultHeader = Header

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function dummyLink({ href, rel, target, title, ...rest }: any) {
  return <span {...rest} />
}

const dummyComponent = (name: string) => () => {
  console.warn(
    `Warning: using empty component "${name}" (you should override this in NotionRenderer.components)`
  )

  return null
}

// TODO: should we use React.memo here?
// https://reactjs.org/docs/react-api.html#reactmemo
const dummyOverrideFn = (_: any, defaultValueFn: () => React.ReactNode) =>
  defaultValueFn()

const defaultComponents: NotionComponents = {
  Image: null, // disable custom images by default
  Link: DefaultLinkMemo,
  PageLink: DefaultPageLinkMemo,
  Checkbox: DefaultCheckbox,
  Callout: undefined, // use the built-in callout rendering by default

  Code: dummyComponent('Code'),
  Equation: dummyComponent('Equation'),

  Collection: dummyComponent('Collection'),
  Property: undefined, // use the built-in property rendering by default

  propertyTextValue: dummyOverrideFn,
  propertySelectValue: dummyOverrideFn,
  propertyRelationValue: dummyOverrideFn,
  propertyFormulaValue: dummyOverrideFn,
  propertyTitleValue: dummyOverrideFn,
  propertyPersonValue: dummyOverrideFn,
  propertyFileValue: dummyOverrideFn,
  propertyCheckboxValue: dummyOverrideFn,
  propertyUrlValue: dummyOverrideFn,
  propertyEmailValue: dummyOverrideFn,
  propertyPhoneNumberValue: dummyOverrideFn,
  propertyNumberValue: dummyOverrideFn,
  propertyLastEditedTimeValue: dummyOverrideFn,
  propertyCreatedTimeValue: dummyOverrideFn,
  propertyDateValue: dummyOverrideFn,
  propertyAutoIncrementIdValue: dummyOverrideFn,

  Pdf: dummyComponent('Pdf'),
  Tweet: dummyComponent('Tweet'),
  Modal: dummyComponent('Modal'),

  Header: DefaultHeader,
  Embed: DefaultEmbed
}

const defaultNotionContext: NotionContext = {
  recordMap: {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
    embeddedFormsBaseUrl: ''
  },

  components: defaultComponents,

  mapPageUrl: defaultMapPageUrl(),
  mapImageUrl: defaultMapImageUrl,
  searchNotion: undefined,
  isShowingSearch: false,
  onHideSearch: undefined,

  fullPage: false,
  darkMode: false,
  previewImages: false,
  forceCustomImages: false,
  showCollectionViewDropdown: true,
  linkTableTitleProperties: true,
  isLinkCollectionToUrlProperty: false,

  showTableOfContents: false,
  minTableOfContentsItems: 3,

  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  zoom: null
}

const ctx = React.createContext<NotionContext>(defaultNotionContext)

export function NotionContextProvider({
  components: themeComponents = {},
  children,
  mapPageUrl,
  mapImageUrl,
  rootPageId,
  ...rest
}: PartialNotionContext & {
  children?: React.ReactNode
}) {
  for (const key of Object.keys(rest)) {
    if ((rest as any)[key] === undefined) {
      delete (rest as any)[key]
    }
  }

  const wrappedThemeComponents = React.useMemo(
    () => ({
      ...themeComponents
    }),
    [themeComponents]
  )

  if (
    wrappedThemeComponents.nextImage &&
    wrappedThemeComponents.nextLegacyImage
  ) {
    console.warn(
      'You should not pass both nextImage and nextLegacyImage. Only nextImage component will be used.'
    )
    wrappedThemeComponents.Image = wrapNextImage(themeComponents.nextImage)
  } else if (wrappedThemeComponents.nextImage) {
    wrappedThemeComponents.Image = wrapNextImage(themeComponents.nextImage)
  } else if (wrappedThemeComponents.nextLegacyImage) {
    wrappedThemeComponents.Image = wrapNextLegacyImage(
      themeComponents.nextLegacyImage
    )
  }

  if (wrappedThemeComponents.nextLink) {
    wrappedThemeComponents.nextLink = wrapNextLink(themeComponents.nextLink)
  }

  // ensure the user can't override default components with falsy values
  // since it would result in very difficult-to-debug react errors
  for (const key of Object.keys(wrappedThemeComponents)) {
    if (!(wrappedThemeComponents as any)[key]) {
      delete (wrappedThemeComponents as any)[key]
    }
  }

  const value = React.useMemo(
    () => ({
      ...defaultNotionContext,
      ...rest,
      rootPageId,
      mapPageUrl: mapPageUrl ?? defaultMapPageUrl(rootPageId),
      mapImageUrl: mapImageUrl ?? defaultMapImageUrl,
      components: { ...defaultComponents, ...wrappedThemeComponents }
    }),
    [mapImageUrl, mapPageUrl, wrappedThemeComponents, rootPageId, rest]
  )

  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export const NotionContextConsumer = ctx.Consumer

export const useNotionContext = (): NotionContext => {
  return React.useContext(ctx)
}
