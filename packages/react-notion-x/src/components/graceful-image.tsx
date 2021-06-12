import React from 'react'
import { Img, ImgProps } from 'react-image'
import { isBrowser } from '../utils'

export const GracefulImage = (props: ImgProps) => {
  if(isBrowser) {
    return <Img {...props} />
  } else {
    // @ts-ignore (must use the appropriate subset of props for <img> if using SSR)
    return <img {...props} />
  }
}
