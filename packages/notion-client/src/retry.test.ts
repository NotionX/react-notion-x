import { type FetchContext } from 'ofetch'
import { describe, expect, test } from 'vitest'

import {
  defaultMaxRetries,
  defaultRetryStatusCodes,
  getRetryDelay,
  getServerSuggestedDelay,
  parseRetryAfter
} from './retry'

function createContext({
  retry,
  retryAfter,
  status = 429,
  data
}: {
  retry?: number
  retryAfter?: string
  status?: number
  data?: unknown
} = {}) {
  return {
    options: { retry },
    response: {
      status,
      _data: data,
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

describe('getServerSuggestedDelay', () => {
  test('prefers the Retry-After header', () => {
    const context = createContext({
      retryAfter: '2',
      data: { clientData: { retryAfter: 99 } }
    })
    expect(getServerSuggestedDelay(context.response)).toBe(2000)
  })

  test('falls back to the clientData.retryAfter body hint', () => {
    const context = createContext({ data: { clientData: { retryAfter: 7 } } })
    expect(getServerSuggestedDelay(context.response)).toBe(7000)
  })

  test('clamps a server-suggested delay to the max', () => {
    const context = createContext({ retryAfter: '9999' })
    expect(getServerSuggestedDelay(context.response)).toBe(120_000)
  })

  test('tolerates an HTML error body from the edge', () => {
    const context = createContext({ data: '<html>rate limited</html>' })
    expect(getServerSuggestedDelay(context.response)).toBeUndefined()
  })

  test('returns undefined when nothing is suggested', () => {
    expect(getServerSuggestedDelay(createContext().response)).toBeUndefined()
  })
})

describe('getRetryDelay', () => {
  test('respects a server-suggested delay', () => {
    expect(getRetryDelay(createContext({ retryAfter: '2' }))).toBe(2000)
  })

  test('waits out the cooldown on 429 rather than backing off from 1s', () => {
    // retrying inside the cooldown window cannot succeed, so even the first
    // 429 retry must wait it out
    for (const retry of [3, 2, 1]) {
      const delay = getRetryDelay(createContext({ status: 429, retry }))
      expect(delay).toBeGreaterThanOrEqual(60_000)
      expect(delay).toBeLessThanOrEqual(75_000)
    }
  })

  test('backs off exponentially with full jitter on transient errors', () => {
    // full jitter is uniform over [0, exponential], so assert the ceiling
    const ceilings = [1000, 2000, 4000]
    for (const [i, retry] of [3, 2, 1].entries()) {
      const delays = Array.from({ length: 50 }, () =>
        getRetryDelay(createContext({ status: 503, retry }), defaultMaxRetries)
      )
      for (const delay of delays) {
        expect(delay).toBeGreaterThanOrEqual(0)
        expect(delay).toBeLessThanOrEqual(ceilings[i]!)
      }
    }
  })

  test('caps exponential backoff at the max delay', () => {
    const delays = Array.from({ length: 50 }, () =>
      getRetryDelay(createContext({ status: 503, retry: 0 }), 100)
    )
    for (const delay of delays) {
      expect(delay).toBeLessThanOrEqual(60_000)
    }
  })
})

describe('defaultRetryStatusCodes', () => {
  test('retries rate limits, gateway errors, and transport failures', () => {
    // ofetch synthesizes a 500 for network-level failures
    for (const code of [429, 500, 502, 503, 504]) {
      expect(defaultRetryStatusCodes).toContain(code)
    }
  })

  test('does not retry client errors that will never succeed', () => {
    // private pages return 400; retrying them wastes the budget
    for (const code of [400, 401, 403, 404, 409, 425]) {
      expect(defaultRetryStatusCodes).not.toContain(code)
    }
  })
})
