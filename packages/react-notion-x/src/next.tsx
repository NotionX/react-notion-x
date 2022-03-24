import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export const image = ({
  src,
  alt,

  width,
  height,

  className,
  style,

  ...rest
}) => {
  const layout = width && height ? 'intrinsic' : 'fill'

  return (
    <Image
      {...rest}
      className={className}
      src={src}
      alt={alt}
      width={layout === 'intrinsic' && width}
      height={layout === 'intrinsic' && height}
      objectFit={style?.objectFit}
      objectPosition={style?.objectPosition}
      layout={layout}
    />
  )
}

export const pageLink = ({
  href,
  as,
  passHref,
  prefetch,
  replace,
  scroll,
  shallow,
  locale,
  ...props
}) => (
  <Link
    href={href}
    as={as}
    passHref={passHref}
    prefetch={prefetch}
    replace={replace}
    scroll={scroll}
    shallow={shallow}
    locale={locale}
  >
    <a {...props} />
  </Link>
)
