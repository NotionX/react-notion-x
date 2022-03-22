// TODO: change these to your own values
// NOTE: rootNotionSpaceId is optional; set it to undefined if you don't want to
// use it.
export const rootNotionPageId = '067dd719a912471ea9a3ac10710e7fdf'
export const rootNotionSpaceId = 'fde5ac74-eea3-4527-8f00-4482710e1af3'

export const isDev =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

export const port = process.env.PORT || 3000
export const rootDomain = isDev ? `localhost:${port}` : null
