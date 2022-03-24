import React from 'react'
import NextImage from 'next/image'
import NextLink from 'next/link'

export const Image: React.FC<any> = ({
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
    <NextImage
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

export const PageLink: React.FC<any> = ({
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
  <NextLink
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
  </NextLink>
)
