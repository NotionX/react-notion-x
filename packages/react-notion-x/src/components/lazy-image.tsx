import { normalizeUrl } from 'notion-utils'
import React from 'react'

import { useNotionContext } from '../context'
import { cs } from '../utils'

/**
 * Progressive, lazy images modeled after Medium's LQIP technique.
 */
export function LazyImage({
  src,
  alt,
  className,
  style,
  zoomable = false,
  priority = false,
  unoptimized = false,
  height,
  ...rest
}: {
  src?: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  height?: number
  zoomable?: boolean
  priority?: boolean
  unoptimized?: boolean
}) {
  const { recordMap, zoom, previewImages, forceCustomImages, components } =
    useNotionContext()
  const zoomRef = React.useRef(zoom ? zoom.clone() : null)
  const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null)
  const isLoaded = loadedSrc === src
  const previewImage = previewImages
    ? (recordMap?.preview_images?.[src!] ??
      recordMap?.preview_images?.[normalizeUrl(src)])
    : null

  const onLoad = React.useCallback(
    (e: any) => {
      setLoadedSrc(src ?? null)

      if (zoomable && (e.target.src || e.target.srcset)) {
        if (zoomRef.current) {
          ;(zoomRef.current as any).attach(e.target)
        }
      }
    },
    [src, zoomRef, zoomable]
  )

  if (previewImage) {
    const aspectRatio = previewImage.originalHeight / previewImage.originalWidth

    if (components.Image) {
      return (
        <components.Image
          src={src}
          alt={alt}
          style={style}
          className={className}
          width={previewImage.originalWidth}
          height={previewImage.originalHeight}
          blurDataURL={previewImage.dataURIBase64}
          placeholder='blur'
          priority={priority}
          unoptimized={unoptimized}
          onLoad={onLoad}
        />
      )
    }

    const wrapperStyle: React.CSSProperties = {
      width: '100%'
    }
    const imgStyle: React.CSSProperties = {}

    if (height) {
      wrapperStyle.height = height
    } else {
      imgStyle.position = 'absolute'
      wrapperStyle.paddingBottom = `${aspectRatio * 100}%`
    }

    return (
      <div
        className={cs(
          'lazy-image-wrapper',
          isLoaded && 'lazy-image-loaded',
          className
        )}
        style={wrapperStyle}
      >
        <img
          className='lazy-image-preview'
          src={previewImage.dataURIBase64}
          alt=''
          aria-hidden='true'
          style={style}
          decoding='async'
        />

        <img
          className='lazy-image-real'
          src={src}
          alt={alt}
          style={{
            ...style,
            ...imgStyle
          }}
          width={previewImage.originalWidth}
          height={previewImage.originalHeight}
          decoding='async'
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          onLoad={onLoad}
          {...rest}
        />
      </div>
    )
  } else {
    /*
      NOTE: Using next/image without a pre-defined width/height is a huge pain in
      the ass. If we have a preview image, then this works fine since we know the
      dimensions ahead of time, but if we don't, then next/image won't display
      anything.

      Since next/image is the most common use case for using custom images, and this
      is likely to trip people up, we're disabling non-preview custom images for now.

      If you have a use case that is affected by this, please open an issue on github.
    */
    if (components.Image && forceCustomImages) {
      return (
        <components.Image
          src={src}
          alt={alt}
          className={className}
          style={style}
          width={null}
          height={height || null}
          priority={priority}
          unoptimized={unoptimized}
          onLoad={onLoad}
        />
      )
    }

    // Default image element
    return (
      <img
        className={className}
        style={style}
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding='async'
        onLoad={onLoad}
        {...rest}
      />
    )
  }
}
