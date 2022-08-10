// TODO: change these to your own values
// NOTE: rootNotionSpaceId is optional; set it to undefined if you don't want to
// use it.
export const rootNotionPageId = '9e725a71b1694718bfc46bb4986cd95b'
export const rootNotionSpaceId = undefined

// NOTE: having this enabled can be pretty expensive as it re-generates preview
// images each time a page is built. In a production setting, we recommend that
// you cache the preview image results in a key-value database.
export const previewImagesEnabled = true

export const notionTokenV2 = process.env.NOTION_TOKEN_V2
export const notionActiveUser = process.env.NOTION_ACTIVE_USER

export const isDev =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

export const port = process.env.PORT || 3000
export const rootDomain = isDev ? `localhost:${port}` : null
