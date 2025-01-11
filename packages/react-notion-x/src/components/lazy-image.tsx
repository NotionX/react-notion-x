import * as React from 'react'

import LazyLoad from 'react-lazyload' // Import react-lazyload
import { cs } from '../utils'
import { normalizeUrl } from 'notion-utils'
import { useNotionContext } from '../context'

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
}) {
  const { recordMap, zoom, previewImages, components } = useNotionContext()
  const zoomRef = React.useRef(zoom ? zoom.clone() : null)
  const previewImage = previewImages
    ? (recordMap?.preview_images?.[src!] ??
      recordMap?.preview_images?.[normalizeUrl(src)])
    : null

  const onLoad = React.useCallback(
    (e: any) => {
      if (zoomable && (e.target.src || e.target.srcset)) {
        if (zoomRef.current) {
          ;(zoomRef.current as any).attach(e.target)
        }
      }
    },
    [zoomRef, zoomable]
  )

  const attachZoom = React.useCallback(
    (image: any) => {
      if (zoomRef.current && image) {
        ;(zoomRef.current as any).attach(image)
      }
    },
    [zoomRef]
  )

  const attachZoomRef = React.useMemo(
    () => (zoomable ? attachZoom : undefined),
    [zoomable, attachZoom]
  )

  if (previewImage) {
    // const aspectRatio = previewImage.originalHeight / previewImage.originalWidth

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
          onLoad={onLoad}
        />
      )
    }

    return (
      <LazyLoad height={height || 'auto'} offset={100} once>
        <img
          className={cs('lazy-image-wrapper', className)}
          src={src}
          alt={alt}
          ref={attachZoomRef}
          style={{ ...style, width: '100%', height: 'auto' }}
          decoding='async'
          loading='lazy'
        />
      </LazyLoad>
    )
  } else {
    // Default image element
    return (
      <img
        className={className}
        style={style}
        src={src}
        alt={alt}
        ref={attachZoomRef}
        loading='lazy'
        decoding='async'
        {...rest}
      />
    )
  }
}
