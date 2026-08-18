import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, test } from 'vitest'

import { wrapNextImage } from './next'

describe('wrapNextImage', () => {
  let receivedProps: Record<string, unknown> | undefined

  const NextImage = (props: Record<string, unknown>) => {
    receivedProps = props
    return null
  }
  const Image = wrapNextImage(NextImage)

  beforeEach(() => {
    receivedProps = undefined
  })

  test('uses intrinsic dimensions when both are known', () => {
    renderToStaticMarkup(
      <Image src='image.jpg' alt='image' width={1200} height={800} />
    )

    expect(receivedProps).toMatchObject({
      src: 'image.jpg',
      alt: 'image',
      width: 1200,
      height: 800,
      fill: false
    })
  })

  test('uses fill when intrinsic dimensions are unknown', () => {
    renderToStaticMarkup(<Image src='image.jpg' alt='image' />)

    expect(receivedProps).toMatchObject({
      src: 'image.jpg',
      alt: 'image',
      fill: true
    })
    expect(receivedProps?.width).toBeUndefined()
    expect(receivedProps?.height).toBeUndefined()
  })

  test('maps priority to the modern preload prop', () => {
    renderToStaticMarkup(
      <Image
        src='image.jpg'
        alt='image'
        width={1200}
        height={800}
        priority={true}
        loading='lazy'
      />
    )

    expect(receivedProps?.preload).toBe(true)
    expect(receivedProps?.loading).toBeUndefined()
    expect(receivedProps).not.toHaveProperty('priority')
  })
})
