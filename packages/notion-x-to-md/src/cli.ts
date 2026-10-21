#!/usr/bin/env node
import { program } from 'commander'
import { NotionAPI } from 'notion-client'

import { notionPageToMarkdown } from './notion-page-to-markdown'

program
  .name('notion-x-to-md')
  .description('Converts a Notion page to Markdown')
  .argument('<page>', 'Notion page ID or URL (must be publicly accessible)')
  .option(
    '--decode-escaped-math',
    'Decode one extra escaping layer in page equations'
  )
  .action(async (page: string, options: { decodeEscapedMath?: boolean }) => {
    const api = new NotionAPI()
    const recordMap = await api.getPage(page)
    const markdown = await notionPageToMarkdown(recordMap, options)
    console.log(markdown)
  })

await program.parseAsync()
