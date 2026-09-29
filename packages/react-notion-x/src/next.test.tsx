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

  const NextLink = (props: Record<string, unknown>) => {
    receivedProps = props
    return null
  }
  const Link = wrapNextLink(NextLink)

  beforeEach(() => {
    receivedProps = undefined
  })

  test('passes anchor props straight to the Next.js link', () => {
    renderToStaticMarkup(
      <Link href='/my-page' className='notion-page-link'>
        My page
      </Link>
    )

    expect(receivedProps).toMatchObject({
      href: '/my-page',
      className: 'notion-page-link',
      children: 'My page'
    })
    expect(receivedProps).not.toHaveProperty('legacyBehavior')
    expect(receivedProps).not.toHaveProperty('passHref')
  })

  test('disables prefetching unless requested', () => {
    renderToStaticMarkup(<Link href='/a' />)
    expect(receivedProps?.prefetch).toBe(false)

    renderToStaticMarkup(<Link href='/a' prefetch={true} />)
    expect(receivedProps?.prefetch).toBe(true)
  })
})

describe('NotionContextProvider with nextLink', () => {
  const NextLink = () => null
  const CustomPageLink = () => null

  const Probe = () => {
    const { components } = useNotionContext()
    const pageLink =
      components.PageLink === components.nextLink
        ? 'nextLink'
        : components.PageLink === CustomPageLink
          ? 'custom'
          : 'other'

    return <span>{pageLink}</span>
  }

  function renderPageLinkKind(components: Record<string, unknown>) {
    return renderToStaticMarkup(
      <NotionContextProvider components={components as any}>
        <Probe />
      </NotionContextProvider>
    )
  }

  test('uses the Next.js link for internal page links', () => {
    expect(renderPageLinkKind({ nextLink: NextLink })).toBe(
      '<span>nextLink</span>'
    )
  })

  test('keeps a custom PageLink', () => {
    expect(
      renderPageLinkKind({ nextLink: NextLink, PageLink: CustomPageLink })
    ).toBe('<span>custom</span>')
  })

  test('falls back to a plain anchor without nextLink', () => {
    expect(renderPageLinkKind({})).toBe('<span>other</span>')
  })
})
