import { getBlockValue, parsePageId } from 'notion-utils'
import { expect, test } from 'vitest'

import { NotionAPI } from './notion-api'

const pageIdFixturesSuccess = [
  '78fc5a4b88d74b0e824e29407e9f1ec1',
  '067dd719-a912-471e-a9a3-ac10710e7fdf',
  '067dd719a912471ea9a3ac10710e7fdf',
  'https://www.notion.so/saasifysh/Embeds-5d4e290ca4604d8fb809af806a6c1749',
  'https://www.notion.so/saasifysh/File-Uploads-34d650c65da34f888335dbd3ddd141dc',
  'Color-Rainbow-54bf56611797480c951e5c1f96cb06f2',
  'e68c18a461904eb5a2ddc3748e76b893',
  'https://www.notion.so/saasifysh/Saasify-Key-Takeaways-689a8abc1afa4699905aa2f2e585e208',
  'https://www.notion.so/saasifysh/TransitiveBullsh-it-78fc5a4b88d74b0e824e29407e9f1ec1',
  'https://www.notion.so/saasifysh/About-8d0062776d0c4afca96eb1ace93a7538',
  'https://www.notion.so/potionsite/newest-board-a899b98b7cdc424585e5ddebbdae60cc',
  '2fea615a97a7401c81be486e4eec2e94'

  // collections stress test
  // NOTE: removing because of sporadic timeouts
  // 'nba-3f92ae505636427c897634a15b9f2892'
]

const pageIdFixturesFailure = [
  'bdecdf150d0e40cb9f3412be132335d4', // private page
  'foo' // invalid page id
]

for (const input of pageIdFixturesSuccess) {
  test(
    `NotionAPI.getPage success ${input}`,
    {
      timeout: 60_000 // one minute timeout
    },
    async () => {
      const pageId = parsePageId(input)
      if (!pageId) {
        throw new Error(`Invalid page id "${input}"`)
      }

      const api = new NotionAPI()
      const page = await api.getPage(pageId, { throwOnCollectionErrors: true })
      expect(page).toBeTruthy()
      expect(page.block).toBeTruthy()
      expect(page.block[pageId]).toBeTruthy()
      expect(getBlockValue(page.block[pageId])).toBeTruthy()
      expect(getBlockValue(page.block[pageId])?.id).toBe(pageId)
    }
  )
}

for (const pageId of pageIdFixturesFailure) {
  test(`NotionAPI.getPage failure ${pageId}`, async () => {
    const api = new NotionAPI()
    await expect(() => api.getPage(pageId)).rejects.toThrow()
  })
}
