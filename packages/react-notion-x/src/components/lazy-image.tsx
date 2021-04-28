import React from 'react'
import { LazyImageFull, ImageState } from 'react-lazy-images'
import { useNotionContext } from '../context'
import { cs } from '../utils'

/**
 * Progressive, lazy images modeled after Medium's LQIP technique.
 */
export const LazyImage: React.FC<{
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  height?: number
  zoomable?: boolean
}> = ({ src, alt, className, style, zoomable = false, height, ...rest }) => {
  const { recordMap, zoom, previewImages } = useNotionContext()

  const zoomRef = React.useRef(zoom ? zoom.clone() : null)
  const previewImage = previewImages
    ? (recordMap as any)?.preview_images?.[src]
    : null

  function attachZoom(image: any) {
    if (zoomRef.current) {
      ;(zoomRef.current as any).attach(image)
    }
  }

  const attachZoomRef = zoomable ? attachZoom : undefined

  if (previewImage) {
    const aspectRatio = previewImage.originalHeight / previewImage.originalWidth

    return (
      <LazyImageFull src={src} {...rest}>
        {({ imageState, ref }) => {
          const isLoaded = imageState === ImageState.LoadSuccess

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
                src={previewImage.dataURIBase64}
                alt={alt}
                ref={ref}
                className='lazy-image-preview'
                style={style}
                width={previewImage.originalWidth}
                height={previewImage.originalHeight}
                decoding='async'
              />

              <img
                src={src}
                alt={alt}
                ref={attachZoomRef}
                className='lazy-image-real'
                style={{
                  ...style,
                  ...imgStyle
                }}
                width={previewImage.originalWidth}
                height={previewImage.originalHeight}
                decoding='async'
                loading='lazy'
              />
            </div>
          )
        }}
      </LazyImageFull>
    )
  } else {
    // TODO: GracefulImage doesn't seem to support refs, but we'd like to prevent
    // invalid images from loading as error states
    return (
      <img
        className={className}
        style={style}
        src={src}
        ref={attachZoomRef}
        loading='lazy'
        alt={alt}
        decoding='async'
        {...rest}
      />
    )
  }
}
