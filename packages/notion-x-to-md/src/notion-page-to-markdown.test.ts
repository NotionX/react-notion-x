import { mkdir, writeFile } from 'node:fs/promises'

import { NotionAPI } from 'notion-client'
import { expect, test } from 'vitest'

import { notionPageToMarkdown } from './notion-page-to-markdown'

const pageIdFixtures = [
  '067dd719a912471ea9a3ac10710e7fdf',
  'de14421f13914ac7b528fa2e31eb1455',
  '0be6efce9daf42688f65c76b89f8eb27',
  'c1c8f540c06f4ac89f831e4a9cc402ae',
  '38fa73d49b8f40aab1f3f8c82332e518',
  '5995506f2c564d81956aa38711e12337',
  '3492bd6dbaf44fe7a5cac62c5d402f06',
  '912379b0c54440a286619f76446cd753',
  '5d4e290ca4604d8fb809af806a6c1749',
  '7820b2d5300747b38e31344eb06fbd57',
  '8bcd65801a5d450fb7218d8890a38c29',
  '30bedb27f12481cc9d6afe0976b52e60',
  '52353862df0f48ba85648db7d0acd1dd',
  '2fea615a97a7401c81be486e4eec2e94', // collections
  '17aef37fb4624588ab1ff0e6671acba5', // collection number formatting
  '9d9814f3220a4b3bbc2481ad6fd7c913',
  '0c322c33381c49bca5083a451c334c39'
  // TODO: re-add these tests (they fail because of date rendering being different on CI vs local)
  // '9cb9716c93164c6c8b4cd0bac3879aeb',
  // 'faafed747a464097a28e462ce4952506',
  // '7b7f063709034186adbfb46f455d5065',
]

const writeExamples = false

for (const id of pageIdFixtures) {
  test(
    `notionPageToMarkdown success ${id}`,
    {
      timeout: 60_000
    },
    async () => {
      const api = new NotionAPI()
      const recordMap = await api.getPage(id)
      const markdown = await notionPageToMarkdown(recordMap)

      if (writeExamples) {
        console.log(`${id}.md\n${markdown}`)
        await mkdir('examples', { recursive: true })
        await writeFile(`examples/${id}.md`, markdown)
      }

      expect(markdown).toBeTruthy()
      expect(markdown.trim()).toEqual(markdown)
      expect(markdown).toMatchSnapshot()
    }
  )
}
