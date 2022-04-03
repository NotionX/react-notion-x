import { Client } from '@notionhq/client'
import { NotionCompatAPI } from 'notion-compat'
// import { NotionAPI } from 'notion-client'

// const notion = new NotionAPI()
// export default notion

export default new NotionCompatAPI(
  new Client({ auth: process.env.NOTION_TOKEN })
)
