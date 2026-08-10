#!/usr/bin/env node
import { parseArgs } from 'node:util'

import { NotionAPI } from 'notion-client'

import { notionPageToMarkdown } from './notion-page-to-markdown'

const { values, positionals } = parseArgs({
  options: {
    help: {
      type: 'boolean',
      short: 'h'
    }
  },
  allowPositionals: true
})

if (values.help) {
  console.log(`notion-x-to-md Converts a Notion page to Markdown

notion-x-to-md <page>
<page> Notion page ID or URL (must be publicly accessible)
`)
  process.exit(0)
}

const page = positionals.at(0)

if (!page) {
  console.error('No page specified')
  process.exit(1)
}

const api = new NotionAPI()
const recordMap = await api.getPage(page)
const markdown = await notionPageToMarkdown(recordMap)
console.log(markdown)
