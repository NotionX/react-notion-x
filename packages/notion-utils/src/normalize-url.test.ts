import { expect, test } from 'vitest'

import { normalizeUrl } from './normalize-url'

test('normalizeUrl invalid', () => {
  expect(normalizeUrl()).toBe('')
  expect(normalizeUrl('')).toBe('')
  expect(normalizeUrl('#')).toBe('')
  expect(normalizeUrl('#foo')).toBe('')
  expect(normalizeUrl('/foo')).toBe('')
  expect(normalizeUrl('/foo/bar')).toBe('')
  expect(normalizeUrl('://test.com')).toBe('')
})

test('normalizeUrl valid', () => {
  const fixtures = [
    'test.com',
    'test.com/123',
    '//test.com',
    'https://test.com',
    'https://www.test.com',
    'https://test.com/foo/bar',
    'https://test.com/foo/bar/',
    'https://test.com/foo/bar?foo=bar&cat=dog',
    'https://www.notion.so/image/https%3A%2F%2Fs3.us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fae16c287-668f-4ea7-90a8-5ed96302e14f%2Fquilt-opt.jpg%3FX-Amz-Algorithm%3DAWS4-HMAC-SHA256%26X-Amz-Content-Sha256%3DUNSIGNED-PAYLOAD%26X-Amz-Credential%3DAKIAT73L2G45EIPT3X45%252F20220327%252Fus-west-2%252Fs3%252Faws4_request%26X-Amz-Date%3D20220327T124856Z%26X-Amz-Expires%3D86400%26X-Amz-Signature%3Dfdaa47d722db4b4052267d999003c6392bbd3d8c4169268b202b8268b2af12ab%26X-Amz-SignedHeaders%3Dhost%26x-id%3DGetObject?table=block&id=ddec4f2d-6afa-498f-8141-405647e02ea5&cache=v2'
  ]

  for (const url of fixtures) {
    const normalizedUrl = normalizeUrl(url)
    expect(normalizedUrl).toBeTruthy()
    expect(normalizedUrl).toMatchSnapshot()
  }
})
