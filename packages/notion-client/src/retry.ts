import { type FetchContext } from 'ofetch'

/**
 * Default number of times to retry failed Notion API requests.
 *
 * NOTE: `ofetch` defaults to `0` retries for payload methods (`POST`, `PUT`,
 * `PATCH`, and `DELETE`), and every unofficial Notion API endpoint is a `POST`,
 * so without an explicit default a single `429 Too Many Requests` response
 * would fail the whole request. This is especially painful during static site
 * generation, where many pages are fetched in parallel.
 */
export const defaultMaxRetries = 3

const initialRetryDelayMs = 1000
const maxRetryDelayMs = 30_000

/**
 * Parses an HTTP `Retry-After` header, which may either be a number of seconds
 * or an HTTP date.
 *
 * @returns The delay in milliseconds, or `undefined` if the header is missing
 * or malformed.
 */
export function parseRetryAfter(
  retryAfter: string | null | undefined
): number | undefined {
  if (!retryAfter) return undefined

  const seconds = Number.parseFloat(retryAfter)
  if (Number.isFinite(seconds)) {
    return Math.max(0, seconds * 1000)
  }

  const date = Date.parse(retryAfter)
  if (!Number.isNaN(date)) {
    return Math.max(0, date - Date.now())
  }

  return undefined
}

/**
 * Computes how long to wait before retrying a failed Notion API request.
 *
 * Respects the `Retry-After` response header if Notion sends one; otherwise
 * backs off exponentially. Jitter is applied so that a batch of requests which
 * get rate-limited at the same time don't all retry in lockstep.
 *
 * @param context - The `ofetch` context for the failed request.
 * @param maxRetries - The max number of retries configured for the request,
 * used to derive which attempt this is.
 *
 * @returns The delay in milliseconds.
 */
export function getRetryDelay(
  context: FetchContext,
  maxRetries = defaultMaxRetries
): number {
  const retryAfter = parseRetryAfter(
    context.response?.headers?.get('retry-after')
  )
  if (retryAfter !== undefined) {
    return Math.min(retryAfter, maxRetryDelayMs)
  }

  // `ofetch` decrements `retry` on each attempt, so the remaining retry count
  // tells us how many attempts we've already burned.
  const retriesRemaining =
    typeof context.options.retry === 'number'
      ? context.options.retry
      : maxRetries
  const attempt = Math.max(0, Math.min(maxRetries - retriesRemaining, 16))
  const delay = Math.min(initialRetryDelayMs * 2 ** attempt, maxRetryDelayMs)

  // full jitter across the upper half of the backoff window
  return Math.round(delay / 2 + Math.random() * (delay / 2))
}
