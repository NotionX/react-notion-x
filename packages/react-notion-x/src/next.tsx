import React from 'react'
import isEqual from 'react-fast-compare'

export const wrapNextImage = (NextImage: any): React.FC<any> => {
  return React.memo(function ReactNotionXNextImage({
    src,
    alt = '',

    width,
    height,

    className,

    fill,
    preload,
    priority,
    loading,

    ...rest
  }) {
    const hasIntrinsicSize =
      typeof width === 'number' &&
      width > 0 &&
      typeof height === 'number' &&
      height > 0
    const shouldFill = fill ?? !hasIntrinsicSize
    const shouldPreload = preload ?? priority

    return (
      <NextImage
        className={className}
        src={src}
        alt={alt}
        width={shouldFill ? undefined : width}
        height={shouldFill ? undefined : height}
        fill={shouldFill}
        preload={shouldPreload || undefined}
        loading={shouldPreload ? undefined : loading}
        {...rest}
      />
    )
  }, isEqual)
}

export function wrapNextLink(NextLink: any): React.FC<any> {
  return function ReactNotionXNextLink({
    href,
    as,
    passHref: _passHref,
    prefetch,
    replace,
    scroll,
    shallow,
    locale,
    ...linkProps
  }) {
    return (
      <NextLink
        href={href}
        as={as}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={locale}
        {...linkProps}
      />
    )
  }
}
