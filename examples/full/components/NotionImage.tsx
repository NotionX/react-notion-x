import Image from 'next/image'
import { useState } from 'react'

type Props = {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  className?: string
  objectFit?: React.CSSProperties['objectFit']
  objectPosition?: React.CSSProperties['objectPosition']
  layout?: 'fill' | 'intrinsic' | 'fixed' | 'responsive'
  [key: string]: unknown
}

// next/image(legacy) 전용 props는 일반 <img>에 전달하지 않음
const NEXT_IMAGE_ONLY_PROPS = new Set(['layout', 'objectFit', 'objectPosition'])

export function NotionImage({
  src,
  alt = '',
  width,
  height,
  className,
  objectFit,
  objectPosition,
  layout,
  ...rest
}: Props) {
  const [useFallback, setUseFallback] = useState(false)

  // next/image(legacy)로 fallback
  if (useFallback) {
    return (
      <Image
        src={src}
        alt={alt}
        width={layout === 'intrinsic' && width ? Number(width) : undefined}
        height={layout === 'intrinsic' && height ? Number(height) : undefined}
        fill={!width || !height || layout === 'fill'}
        className={className}
        style={{ objectFit, objectPosition }}
      />
    )
  }

  // layout prop을 CSS로 변환
  const imgStyle: React.CSSProperties = { objectFit, objectPosition }
  if (layout === 'fill') {
    imgStyle.position = 'absolute'
    imgStyle.width = '100%'
    imgStyle.height = '100%'
  }

  // next/image 전용 props 제거 후 <img>에 전달
  const safeRest = Object.fromEntries(
    Object.entries(rest).filter(([key]) => !NEXT_IMAGE_ONLY_PROPS.has(key))
  )

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={imgStyle}
      onError={() => setUseFallback(true)}
      {...safeRest}
    />
  )
}
