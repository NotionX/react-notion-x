import React from 'react'
import isEqual from 'react-fast-compare'

export const wrapNextImage = (NextImage: any): React.FC<any> => {
  return React.memo(function ReactNotionXNextImage({
    src,
    alt,

    width,
    height,

    className,

    fill,

    ...rest
  }) {
    if (fill === 'undefined') {
      fill = !(width && height)
    }

    return (
      <NextImage
        className={className}
        src={src}
        alt={alt}
        width={!fill && width && height ? width : undefined}
        height={!fill && width && height ? height : undefined}
        fill={fill}
        {...rest}
      />
    )
  }, isEqual)
}

export const wrapNextLegacyImage = (NextLegacyImage: any): React.FC<any> => {
  return React.memo(function ReactNotionXNextLegacyImage({
    src,
    alt,

    width,
    height,

    className,
    style,

    layout,

    ...rest
  }) {
    if (!layout) {
      layout = width && height ? 'intrinsic' : 'fill'
    }

    return (
      <NextLegacyImage
        className={className}
        src={src}
        alt={alt}
        width={layout === 'intrinsic' && width}
        height={layout === 'intrinsic' && height}
        objectFit={style?.objectFit}
        objectPosition={style?.objectPosition}
        layout={layout}
        {...rest}
      />
    )
  }, isEqual)
}

export function wrapNextLink(NextLink: any) {
  return ({
    href,
    as,
    passHref,
    prefetch,
    replace,
    scroll,
    shallow,
    locale,
    ...linkProps
  }: any) => {
    return (
      <NextLink
        href={href}
        as={as}
        passHref={passHref}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={locale}
        legacyBehavior
      >
        <a {...linkProps} />
      </NextLink>
    )
  }
}
