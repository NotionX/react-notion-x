import Head from 'next/head'
import { type ExtendedRecordMap } from 'notion-types'
import { getPageTitle } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'

export function NotionPage({
  recordMap,
  rootPageId,
  enabled = true
}: {
  recordMap: ExtendedRecordMap
  rootPageId?: string
  enabled?: boolean
}) {
  if (!enabled) {
    return (
      <div style={{ padding: '20px' }}>
        <p>
          Hey 👋 I've disabled the public demo for subpages for{' '}
          <a
            href='https://github.com/NotionX/react-notion-x'
            target='_blank'
            rel='noopener noreferrer'
          >
            react-notion-x
          </a>{' '}
          for now because my Vercel bill keeps increasing due to people abusing
          the demo.
        </p>

        <p>
          You can still run the demos locally by checking out the git repo and
          following the instructions in the readme.
        </p>
      </div>
    )
  }

  if (!recordMap) {
    return null
  }

  const title = getPageTitle(recordMap)

  return (
    <>
      <Head>
        <meta name='description' content='React Notion X Minimal Demo' />

        <title>{title}</title>
      </Head>

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        rootPageId={rootPageId}
      />
    </>
  )
}
