// TODO: change this to the notion ID of the page you want to test
// my example notion page implementing buttons https://www.notion.so/Notion-API-Testing-Page-30a2598df29f8002ac30fdbb98ae3eb5
export const rootNotionPageId = '30a2598df29f8002ac30fdbb98ae3eb5'

// NOTE: rootNotionSpaceId is optional; set it to undefined if you don't want to
// use it.
export const rootNotionSpaceId = 'fde5ac74-eea3-4527-8f00-4482710e1af3'

export const isDev =
  process.env.NODE_ENV === 'development' || !process.env.NODE_ENV

console.log({ isDev, NODE_ENV: process.env.NODE_ENV })
