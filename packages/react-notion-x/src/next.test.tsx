import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, test } from 'vitest'

import { NotionContextProvider, useNotionContext } from './context'
import { wrapNextImage, wrapNextLink } from './next'

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

describe('wrapNextLink', () => {
  let receivedProps: Record<string, unknown> | undefined

  const NextLink = ({
    href,
    children,
    className
  }: {
    href?: string
    children?: React.ReactNode
    className?: string
    [key: string]: unknown
  }) => {
    return (
      <a href={href} className={className} data-next-link='true'>
        {children}
      </a>
    )
  }

  const InspectableNextLink = (props: Record<string, unknown>) => {
    receivedProps = props
    return NextLink(props as any)
  }

  beforeEach(() => {
    receivedProps = undefined
  })

  test('forwards anchor props directly to modern next/link without legacyBehavior', () => {
    const Link = wrapNextLink(InspectableNextLink)
    const html = renderToStaticMarkup(
      <Link href='/target-page' className='notion-page-link' prefetch={false}>
        Target Page
      </Link>
    )

    expect(receivedProps).toMatchObject({
      href: '/target-page',
      className: 'notion-page-link',
      prefetch: false
    })
    expect(receivedProps).not.toHaveProperty('legacyBehavior')
    expect(receivedProps).not.toHaveProperty('passHref')
    expect(html).toBe(
      '<a href="/target-page" class="notion-page-link" data-next-link="true">Target Page</a>'
    )
  })

  test('wires components.nextLink to components.PageLink in NotionContextProvider', () => {
    function PageLinkConsumer() {
      const { components } = useNotionContext()
      return (
        <components.PageLink
          href='/11111111222233334444555566667777'
          className='notion-page-link'
        >
          Child Page
        </components.PageLink>
      )
    }

    const html = renderToStaticMarkup(
      <NotionContextProvider components={{ nextLink: InspectableNextLink }}>
        <PageLinkConsumer />
      </NotionContextProvider>
    )

    expect(html).toBe(
      '<a href="/11111111222233334444555566667777" class="notion-page-link" data-next-link="true">Child Page</a>'
    )
  })
})
