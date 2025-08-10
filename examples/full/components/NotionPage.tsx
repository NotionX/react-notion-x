import dynamic from 'next/dynamic'
import Head from 'next/head'
// import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type ExtendedRecordMap } from 'notion-types'
import { getPageTitle } from 'notion-utils'
import { NotionRenderer } from 'react-notion-x'
import TweetEmbed from 'react-tweet-embed'

import { Loading } from './Loading'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then(async (m) => {
    // additional prism syntaxes
    await Promise.all([
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-markup-templating.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-markup.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-bash.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-c.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-cpp.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-csharp.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-docker.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-java.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-js-templates.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-coffeescript.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-diff.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-git.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-go.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-graphql.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-handlebars.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-less.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-makefile.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-markdown.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-objectivec.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-ocaml.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-python.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-reason.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-rust.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-sass.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-scss.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-solidity.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-sql.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-stylus.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-swift.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-wasm.js'),
      // @ts-expect-error ignore no prisma types
      import('prismjs/components/prism-yaml.js')
    ])
    return m.Code
  })
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  {
    ssr: false
  }
)

function Tweet({ id }: { id: string }) {
  return <TweetEmbed tweetId={id} />
}

export function NotionPage({
  recordMap,
  previewImagesEnabled,
  rootPageId,
  rootDomain
}: {
  recordMap: ExtendedRecordMap
  previewImagesEnabled?: boolean
  rootPageId?: string
  rootDomain?: string
}) {
  const router = useRouter()

  if (router.isFallback) {
    return <Loading />
  }

  if (!recordMap) {
    return null
  }

  const title = getPageTitle(recordMap) ?? ''

  // useful for debugging from the dev console
  if (typeof window !== 'undefined') {
    const keys = Object.keys(recordMap?.block || {})
    const block = recordMap?.block?.[keys[0]!]?.value
    const g = window as any
    g.recordMap = recordMap
    g.block = block
  }

  const socialDescription = 'React Notion X Demo'
  const socialImage =
    'https://react-notion-x-demo.transitivebullsh.it/social.jpg'

  return (
    <>
      <Head>
        {socialDescription && (
          <>
            <meta name='description' content={socialDescription} />
            <meta property='og:description' content={socialDescription} />
            <meta name='twitter:description' content={socialDescription} />
          </>
        )}

        {socialImage ? (
          <>
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:image' content={socialImage} />
            <meta property='og:image' content={socialImage} />
          </>
        ) : (
          <meta name='twitter:card' content='summary' />
        )}

        <title>{title}</title>
        <meta property='og:title' content={title} />
        <meta name='twitter:title' content={title} />
        <meta name='twitter:creator' content='@transitive_bs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <NotionRenderer
        recordMap={recordMap}
        fullPage={true}
        darkMode={false}
        rootDomain={rootDomain}
        rootPageId={rootPageId}
        previewImages={previewImagesEnabled}
        components={{
          // NOTE (transitive-bullshit 3/12/2023): I'm disabling next/image for this repo for now because the amount of traffic started costing me hundreds of dollars a month in Vercel image optimization costs. I'll probably re-enable it in the future if I can find a better solution.
          // nextLegacyImage: Image,
          nextLink: Link,
          Code,
          Collection,
          Equation,
          Pdf,
          Modal,
          Tweet
        }}

        // NOTE: custom images will only take effect if previewImages is true and
        // if the image has a valid preview image defined in recordMap.preview_images[src]
      />
    </>
  )
}
