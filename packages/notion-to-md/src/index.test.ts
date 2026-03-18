import { writeFile } from 'node:fs/promises'

import { NotionAPI } from 'notion-client'
import { expect, test } from 'vitest'

import { notionPageToMarkdown } from '.'

const pageIdFixtures = [
  // '067dd719a912471ea9a3ac10710e7fdf'
  'de14421f13914ac7b528fa2e31eb1455' // lists
  // '0be6efce9daf42688f65c76b89f8eb27'
]

for (const id of pageIdFixtures) {
  test(
    `notionPageToMarkdown success ${id}`,
    {
      timeout: 30_000
    },
    async () => {
      const api = new NotionAPI()
      const recordMap = await api.getPage(id)
      const markdown = notionPageToMarkdown(recordMap)

      console.log(`${id}.md\n${markdown}`)
      await writeFile(`${id}.md`, markdown)

      expect(markdown).toBeTruthy()
      expect(markdown.trim()).toMatchSnapshot()
    }
  )
}
