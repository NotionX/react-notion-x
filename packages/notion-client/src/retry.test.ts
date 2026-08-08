import { type FetchContext } from 'ofetch'
import { describe, expect, test } from 'vitest'

import { defaultMaxRetries, getRetryDelay, parseRetryAfter } from './retry'

function createContext({
  retry,
  retryAfter
}: {
  retry?: number
  retryAfter?: string
} = {}) {
  return {
    options: { retry },
    response: {
      status: 429,
      headers: new Headers(retryAfter ? { 'retry-after': retryAfter } : {})
    }
  } as unknown as FetchContext
}

describe('parseRetryAfter', () => {
  test('parses a delay in seconds', () => {
    expect(parseRetryAfter('5')).toBe(5000)
    expect(parseRetryAfter('0.5')).toBe(500)
    expect(parseRetryAfter('0')).toBe(0)
  })

  test('parses an HTTP date', () => {
    const retryAfter = parseRetryAfter(
      new Date(Date.now() + 10_000).toUTCString()
    )
    expect(retryAfter).toBeGreaterThan(8000)
    expect(retryAfter).toBeLessThanOrEqual(10_000)
  })

  test('clamps past HTTP dates to zero', () => {
    expect(parseRetryAfter(new Date(Date.now() - 10_000).toUTCString())).toBe(0)
  })

  test('ignores missing or malformed values', () => {
    expect(parseRetryAfter(undefined)).toBeUndefined()
    expect(parseRetryAfter(null)).toBeUndefined()
    expect(parseRetryAfter('')).toBeUndefined()
    expect(parseRetryAfter('soon')).toBeUndefined()
  })
})

describe('getRetryDelay', () => {
  test('respects the Retry-After header', () => {
    expect(getRetryDelay(createContext({ retryAfter: '2' }))).toBe(2000)
  })

  test('caps Retry-After at the max delay', () => {
    expect(getRetryDelay(createContext({ retryAfter: '600' }))).toBe(30_000)
  })

  test('backs off exponentially across attempts', () => {
    const delays = [3, 2, 1].map((retry) =>
      getRetryDelay(createContext({ retry }), defaultMaxRetries)
    )

    // jittered across the upper half of each backoff window
    expect(delays[0]).toBeGreaterThanOrEqual(500)
    expect(delays[0]).toBeLessThanOrEqual(1000)
    expect(delays[1]).toBeGreaterThanOrEqual(1000)
    expect(delays[1]).toBeLessThanOrEqual(2000)
    expect(delays[2]).toBeGreaterThanOrEqual(2000)
    expect(delays[2]).toBeLessThanOrEqual(4000)
  })

  test('caps exponential backoff at the max delay', () => {
    const delay = getRetryDelay(createContext({ retry: 0 }), 100)
    expect(delay).toBeGreaterThanOrEqual(15_000)
    expect(delay).toBeLessThanOrEqual(30_000)
  })
})
