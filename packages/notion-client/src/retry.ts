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

/**
 * Status codes worth retrying.
 *
 * Deliberately narrower than `ofetch`'s default set: `409 Conflict` and
 * `425 Too Early` aren't transient for this API, and Notion uses `4xx` codes
 * like `400` for legitimately private or missing pages, which should fail fast
 * rather than burn the retry budget.
 *
 * `500` is included because `ofetch` reports transport-level failures (DNS,
 * connection reset, timeouts) with a synthesized `500`, and those are worth
 * retrying.
 */
export const defaultRetryStatusCodes = [408, 429, 500, 502, 503, 504]

const initialRetryDelayMs = 1000
const maxRetryDelayMs = 60_000

/**
 * How long to wait after being rate-limited.
 *
 * Notion applies a fixed cooldown once a client trips a rate limit, so once
 * you've seen a `429`, retrying quickly is guaranteed to fail — every attempt
 * lands inside the same cooldown window and just burns the retry budget. Wait
 * out the cooldown instead of backing off from a short delay.
 */
const rateLimitCooldownMs = 60_000

/**
 * Extra random delay added on top of the rate-limit cooldown, so that a batch
 * of requests which trip the limit together don't all resume in lockstep and
 * immediately trip it again.
 */
const rateLimitJitterMs = 15_000

/** Upper bound on any server-suggested delay, to avoid stalling a build. */
const maxServerSuggestedDelayMs = 120_000

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
 * Extracts a server-suggested retry delay, preferring the standard
 * `Retry-After` header and falling back to the `clientData.retryAfter` hint
 * that the private API includes in some JSON error bodies.
 *
 * NOTE: the private API generally sends neither, so this is best-effort and
 * the exponential fallback in `getRetryDelay` is the common path.
 *
 * @returns The delay in milliseconds, or `undefined` if none was suggested.
 */
export function getServerSuggestedDelay(
  response: FetchContext['response']
): number | undefined {
  const retryAfter = parseRetryAfter(response?.headers?.get('retry-after'))
  if (retryAfter !== undefined) {
    return Math.min(retryAfter, maxServerSuggestedDelayMs)
  }

  // Only `application/json` error bodies carry this; rate-limit responses
  // served by the edge are HTML, in which case `_data` is a string.
  const data = (response as any)?._data
  const hint = data?.clientData?.retryAfter
  if (typeof hint === 'number' && Number.isFinite(hint) && hint >= 0) {
    return Math.min(hint * 1000, maxServerSuggestedDelayMs)
  }

  return undefined
}

/**
 * Computes how long to wait before retrying a failed Notion API request.
 *
 * - Respects a server-suggested delay when one is present.
 * - Waits out the cooldown on `429`, since retrying sooner cannot succeed.
 * - Otherwise backs off exponentially using full jitter, which decorrelates
 *   retries better than a fixed fraction of the backoff window and matches
 *   what Notion's own clients do.
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
  const suggested = getServerSuggestedDelay(context.response)

  if (context.response?.status === 429) {
    // Never retry a rate limit faster than the cooldown, even when the server
    // suggests otherwise. Some layers in front of the API answer with
    // `Retry-After: 0`, and taking that literally burns the entire retry
    // budget in milliseconds while the cooldown is still in effect. A hint may
    // extend the wait, never shorten it.
    const cooldown = Math.round(
      rateLimitCooldownMs + Math.random() * rateLimitJitterMs
    )
    return suggested === undefined ? cooldown : Math.max(suggested, cooldown)
  }

  if (suggested !== undefined) {
    return suggested
  }

  // `ofetch` decrements `retry` on each attempt, so the remaining retry count
  // tells us how many attempts we've already burned.
  const retriesRemaining =
    typeof context.options.retry === 'number'
      ? context.options.retry
      : maxRetries
  const attempt = Math.max(0, Math.min(maxRetries - retriesRemaining, 16))
  const delay = Math.min(initialRetryDelayMs * 2 ** attempt, maxRetryDelayMs)

  // full jitter: uniform over [0, delay]
  return Math.round(Math.random() * delay)
}
