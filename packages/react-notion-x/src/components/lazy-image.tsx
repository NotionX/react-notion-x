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
  fill = false,
  sizes,
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
  fill?: boolean
  sizes?: string
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
      const useBlurPlaceholder =
        previewImage.originalWidth >= 40 && previewImage.originalHeight >= 40

      return (
        <components.Image
          src={src}
          alt={alt}
          style={style}
          className={className}
          width={fill ? undefined : previewImage.originalWidth}
          height={fill ? undefined : previewImage.originalHeight}
          fill={fill}
          sizes={sizes}
          blurDataURL={
            useBlurPlaceholder ? previewImage.dataURIBase64 : undefined
          }
          placeholder={useBlurPlaceholder ? 'blur' : undefined}
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
    // Modern next/image can render unknown-size images with `fill` as long as
    // the containing layout establishes its dimensions. Other unknown-size
    // images keep their native <img> behavior unless explicitly forced.
    if (components.Image && (fill || forceCustomImages)) {
      return (
        <components.Image
          src={src}
          alt={alt}
          className={className}
          style={style}
          height={fill ? undefined : height}
          fill={fill || undefined}
          sizes={sizes}
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
