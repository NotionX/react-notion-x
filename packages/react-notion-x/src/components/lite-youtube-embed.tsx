import React from 'react'

import { cs } from '../utils'

const qs = (params: Record<string, string>) => {
  return Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key]!)}`
    )
    .join('&')
}

type ImageType = 'jpg' | 'webp'

const resolutions = [120, 320, 480, 640, 1280] as const
type VideoResolution = (typeof resolutions)[number]

const resolutionMap: Record<VideoResolution, string> = {
  120: 'default',
  320: 'mqdefault',
  480: 'hqdefault',
  640: 'sddefault',
  1280: 'maxresdefault'
  // 2k, 4k, 8k images don't seem to be available
  // Source: https://longzero.com/articles/youtube-thumbnail-sizes-url/
}

const resolutionSizes = resolutions
  .map((resolution) => `(max-width: ${resolution}px) ${resolution}px`)
  .join(', ')

function getPosterUrl(
  id: string,
  resolution: VideoResolution = 480,
  type: ImageType = 'jpg'
): string {
  if (type === 'webp') {
    return `https://i.ytimg.com/vi_webp/${id}/${resolutionMap[resolution]}.webp`
  }

  // Default to jpg
  return `https://i.ytimg.com/vi/${id}/${resolutionMap[resolution]}.jpg`
}

function generateSrcSet(id: string, type: ImageType = 'jpg'): string {
  return resolutions
    .map((resolution) => `${getPosterUrl(id, resolution, type)} ${resolution}w`)
    .join(', ')
}

export function LiteYouTubeEmbed({
  id,
  defaultPlay = false,
  mute = false,
  lazyImage = false,
  iframeTitle = 'YouTube video',
  alt = 'Video preview',
  params = {},
  adLinksPreconnect = true,
  style,
  className
}: {
  id: string
  defaultPlay?: boolean
  mute?: boolean
  lazyImage?: boolean
  iframeTitle?: string
  alt?: string
  params?: Record<string, string>
  adLinksPreconnect?: boolean
  style?: React.CSSProperties
  className?: string
}) {
  const muteParam = mute || defaultPlay ? '1' : '0' // Default play must be muted
  const queryString = React.useMemo(
    () => qs({ autoplay: '1', mute: muteParam, ...params }),
    [muteParam, params]
  )

  const ytUrl = 'https://www.youtube-nocookie.com'
  const iframeSrc = `${ytUrl}/embed/${id}?${queryString}`

  const [isPreconnected, setIsPreconnected] = React.useState(false)
  const [iframeInitialized, setIframeInitialized] = React.useState(defaultPlay)
  const [isIframeLoaded, setIsIframeLoaded] = React.useState(false)

  const warmConnections = React.useCallback(() => {
    if (isPreconnected) return
    setIsPreconnected(true)
  }, [isPreconnected])

  const onLoadIframe = React.useCallback(() => {
    if (iframeInitialized) return
    setIframeInitialized(true)
  }, [iframeInitialized])

  const onIframeLoaded = React.useCallback(() => {
    setIsIframeLoaded(true)
  }, [])

  return (
    <>
      {/*
        'it seems pretty unlikely for a browser to support preloading but not WebP images'
        Source: https://blog.laurenashpole.com/post/658079409151016960
       */}
      <link
        rel='preload'
        as='image'
        href={getPosterUrl(id)}
        imageSrcSet={generateSrcSet(id, 'webp')}
        imageSizes={resolutionSizes}
      />

      {isPreconnected && (
        <>
          {/* The iframe document and most of its subresources come from youtube.com */}
          <link rel='preconnect' href={ytUrl} />

          {/* The botguard script is fetched off from google.com */}
          <link rel='preconnect' href='https://www.google.com' />
        </>
      )}

      {isPreconnected && adLinksPreconnect && (
        <>
          {/* Not certain if these ad related domains are in the critical path.
              Could verify with domain-specific throttling.
            */}
          <link rel='preconnect' href='https://static.doubleclick.net' />
          <link rel='preconnect' href='https://googleads.g.doubleclick.net' />
        </>
      )}

      <div
        onClick={onLoadIframe}
        onPointerOver={warmConnections}
        className={cs(
          'notion-yt-lite',
          isIframeLoaded && 'notion-yt-loaded',
          iframeInitialized && 'notion-yt-initialized',
          className
        )}
        style={style}
      >
        <picture>
          {/*
            Browsers which don't support srcSet will most likely not support webp too
            These browsers will then just get the default 480 size jpg
           */}
          {resolutions.map((resolution) => (
            <source
              key={resolution}
              srcSet={`${getPosterUrl(id, resolution, 'webp')} ${resolution}w`}
              media={`(max-width: ${resolution}px)`}
              type='image/webp'
            />
          ))}

          <img
            src={getPosterUrl(id)}
            className='notion-yt-thumbnail'
            loading={lazyImage ? 'lazy' : undefined}
            alt={alt}
          />
        </picture>

        <div className='notion-yt-playbtn' />

        {iframeInitialized && (
          <iframe
            width='560'
            height='315'
            frameBorder='0'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            title={iframeTitle}
            src={iframeSrc}
            onLoad={onIframeLoaded}
          />
        )}
      </div>
    </>
  )
}
