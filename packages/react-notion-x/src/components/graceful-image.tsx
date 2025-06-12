import React from 'react'
import { Img, type ImgProps } from 'react-image'

import { isBrowser } from '../utils'

export function GracefulImage(props: ImgProps) {
  if (isBrowser) {
    return <Img {...props} />
  } else {
    // @ts-expect-error (must use the appropriate subset of props for <img> if using SSR)
    return <img {...props} />
  }
}
