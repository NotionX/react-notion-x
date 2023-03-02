import test from 'ava'

test('dummy', async (t) => {
  t.truthy(true)
})

/*
 TODO: this test currently fails because of an [esbuild issue](https://github.com/evanw/esbuild/issues/1921):

 ```
 Uncaught exception in src/notion-compat-api.test.ts

  Error: Dynamic require of "events" is not supported

  › file:///Users/tfischer/dev/modules/react-notion-x/packages/notion-client/build/index.js:1:382
  › file:///Users/tfischer/dev/modules/react-notion-x/node_modules/cacheable-request/src/index.js:3:22
  › file:///Users/tfischer/dev/modules/react-notion-x/packages/notion-client/build/index.js:1:462
  › file:///Users/tfischer/dev/modules/react-notion-x/node_modules/got/dist/source/core/index.js:7:30
 ```
 */

// import { Client } from '@notionhq/client'
// import { promises as fs } from 'fs'
// import { NotionAPI } from 'notion-client'

// import { NotionCompatAPI } from './notion-compat-api'

// const debug = false

// test('NotionCompatAPI', async (t) => {
//   // const pageId = '067dd719a912471ea9a3ac10710e7fdf'
//   const pageId = '8bcd65801a5d450fb7218d8890a38c29'

//   const auth = 'secret_KZ8vNH8UmOGIEQTlcPOp19yAiy0JZbyEqN5mLSqz2HF'

//   const client = new Client({ auth })
//   const compatAPI = new NotionCompatAPI(client)
//   const api = new NotionAPI()

//   const page = await api.getPage(pageId)
//   const compatPage = await compatAPI.getPage(pageId)

//   t.truthy(page)
//   t.truthy(compatPage)

//   if (debug) {
//     await fs.writeFile(`${pageId}.json`, JSON.stringify(page, null, 2))
//     await fs.writeFile(
//       `${pageId}.compat.json`,
//       JSON.stringify(compatPage, null, 2)
//     )
//   }
// })
