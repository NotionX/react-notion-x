import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { fileURLToPath } from 'node:url'
import { setTimeout } from 'node:timers/promises'
import net from 'node:net'
import { isNotionHost, notionImageProxyOrigin } from 'notion-utils'

import {
  imageRegressionBlockId,
  imageRegressionLegacyBlockId,
  imageRegressionLegacySource,
  imageRegressionSource
} from '../lib/image-regression'

const packageDirectory = fileURLToPath(new URL('..', import.meta.url))
const nextBin = fileURLToPath(
  new URL('../node_modules/next/dist/bin/next', import.meta.url)
)

const getAvailablePort = async (): Promise<number> => {
  const listener = net.createServer()
  listener.unref()
  await new Promise<void>((resolve, reject) => {
    listener.once('error', reject)
    listener.listen(0, '127.0.0.1', resolve)
  })

  const address = listener.address()
  assert(address && typeof address !== 'string')
  await new Promise<void>((resolve, reject) =>
    listener.close((error) => (error ? reject(error) : resolve()))
  )
  return address.port
}

const decodeHtmlAttribute = (value: string): string =>
  value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")

const getImageSources = (html: string): string[] =>
  Array.from(html.matchAll(/<img\b[^>]*>/gi)).flatMap(([image]) =>
    Array.from(image.matchAll(/\b(src|srcset)="([^"]+)"/gi)).flatMap(
      ([, name, attribute]) => {
        const decodedAttribute = decodeHtmlAttribute(attribute!)
        return name!.toLowerCase() === 'src'
          ? [decodedAttribute]
          : decodedAttribute
              .split(/\s*,\s*/)
              .map((candidate) => candidate.trim().split(/\s+/)[0]!)
              .filter(Boolean)
      }
    )
  )

const unwrapNextImageSource = (source: string, origin: string): string => {
  try {
    const url = new URL(source, origin)
    if (url.origin === origin && url.pathname === '/_next/image') {
      return url.searchParams.get('url') ?? source
    }
    return url.toString()
  } catch {
    return source
  }
}

const getNextData = (html: string): any => {
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
  )
  assert(match, 'Expected the minimal example to serialize __NEXT_DATA__')
  return JSON.parse(match[1]!)
}

const getNotionProxyImages = (
  imageSources: string[]
): Array<{ source: string; url: URL }> => {
  const images: Array<{ source: string; url: URL }> = []

  for (const imageSource of new Set(imageSources)) {
    try {
      const url = new URL(imageSource)
      if (isNotionHost(url.hostname) && url.pathname.startsWith('/image/')) {
        images.push({
          source: decodeURIComponent(url.pathname.slice('/image/'.length)),
          url
        })
      }
    } catch {
      // Ignore relative and data URLs.
    }
  }

  return images
}

const temporarySigningParameters =
  /[?&](?:signature|sig|tok|exp|expires|expirationTimestamp|x-amz-[^=]+)=/i

const waitForServer = async (url: string, server: ReturnType<typeof spawn>) => {
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before serving ${url}`)
    }

    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(2_000)
      })
      if (response.ok) {
        return response
      }
    } catch {
      // The server is still starting.
    }

    await setTimeout(250)
  }

  throw new Error(`Timed out waiting for ${url}`)
}

const stopServer = async (server: ReturnType<typeof spawn>) => {
  if (server.exitCode !== null) {
    return
  }

  server.kill('SIGTERM')
  await Promise.race([
    once(server, 'exit'),
    setTimeout(5_000, undefined, { ref: false })
  ])
  if (server.exitCode === null) {
    server.kill('SIGKILL')
    await once(server, 'exit')
  }
}

const port = await getAvailablePort()
const origin = `http://127.0.0.1:${port}`
let serverOutput = ''
const server = spawn(
  process.execPath,
  [nextBin, 'start', '--hostname', '127.0.0.1', '--port', String(port)],
  {
    cwd: packageDirectory,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  }
)
for (const stream of [server.stdout, server.stderr]) {
  stream.on('data', (chunk) => {
    serverOutput = `${serverOutput}${chunk}`.slice(-8_000)
  })
}

try {
  const pageResponse = await waitForServer(origin, server)
  const regressionResponse = await fetch(`${origin}/image-regression`, {
    signal: AbortSignal.timeout(10_000)
  })
  assert.equal(regressionResponse.ok, true, 'Image regression page must render')

  const pages = await Promise.all([
    pageResponse.text(),
    regressionResponse.text()
  ])
  const signedUrls = pages.flatMap((html) =>
    Object.values(
      getNextData(html).props?.pageProps?.recordMap?.signed_urls ?? {}
    ).filter((url): url is string => typeof url === 'string')
  )
  const temporarySignedUrls = signedUrls.filter((url) =>
    temporarySigningParameters.test(url)
  )
  assert(
    temporarySignedUrls.length > 0,
    'Expected temporary signed URLs in the cached record maps'
  )
  assert(
    temporarySignedUrls.some((url) => {
      try {
        return new URL(url).searchParams.get('expirationTimestamp') === '1'
      } catch {
        return false
      }
    }),
    'Expected the deterministic expired-signature fixture'
  )

  const imageSources = pages.flatMap(getImageSources)
  assert(imageSources.length > 0, 'Expected rendered image elements')
  const upstreamImageSources = imageSources.map((source) =>
    unwrapNextImageSource(source, origin)
  )
  const notionProxyImages = getNotionProxyImages(upstreamImageSources)
  assert(notionProxyImages.length > 0, 'Expected Notion proxy image URLs')

  assert(
    temporarySignedUrls.every(
      (signedUrl) =>
        ![
          ...upstreamImageSources,
          ...notionProxyImages.map(({ source }) => source)
        ].some((source) => source.includes(signedUrl))
    ),
    'Rendered image attributes must not embed record-map signatures'
  )

  for (const { source, url } of notionProxyImages) {
    assert.equal(
      url.origin,
      notionImageProxyOrigin,
      'Rendered Notion images must use the working app.notion.com proxy'
    )
    assert.equal(url.searchParams.get('table'), 'block')
    assert(url.searchParams.get('id'), 'Expected an image owner ID')
    assert.equal(url.searchParams.get('cache'), 'v2')

    assert(
      !temporarySigningParameters.test(`${url.toString()}&${source}`),
      'Stable image URL must not contain temporary signing parameters'
    )
  }

  const regressionImages = [
    {
      source: imageRegressionSource,
      ownerId: imageRegressionBlockId,
      description: 'attachment image-block regression fixture'
    },
    {
      source: imageRegressionLegacySource,
      ownerId: imageRegressionLegacyBlockId,
      description: 'legacy image-block regression fixture'
    }
  ].map(({ source, ownerId, description }) => {
    const image = notionProxyImages.find(
      (candidate) =>
        candidate.source === source &&
        candidate.url.searchParams.get('id') === ownerId
    )
    assert(image, `Expected the ${description}`)
    return image
  })

  await Promise.all(
    regressionImages.map(async ({ url: stableImageUrl }) => {
      const optimizerUrl = new URL('/_next/image', origin)
      optimizerUrl.searchParams.set('url', stableImageUrl.toString())
      optimizerUrl.searchParams.set('w', '640')
      optimizerUrl.searchParams.set('q', '75')

      const optimizerResponse = await fetch(optimizerUrl, {
        signal: AbortSignal.timeout(30_000)
      })
      assert.equal(
        optimizerResponse.ok,
        true,
        `Next image optimizer returned ${optimizerResponse.status}`
      )
      assert.match(
        optimizerResponse.headers.get('content-type') ?? '',
        /^image\//
      )
      assert((await optimizerResponse.arrayBuffer()).byteLength > 0)
    })
  )

  console.log(
    `Verified ${notionProxyImages.length} stable Notion images and ${regressionImages.length} source forms through the Next image optimizer`
  )
} catch (err) {
  if (serverOutput) {
    console.error(serverOutput)
  }
  throw err
} finally {
  await stopServer(server)
}
