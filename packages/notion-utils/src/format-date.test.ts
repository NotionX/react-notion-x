import { afterAll, beforeAll, expect, test } from 'vitest'

import { formatDate } from './format-date'
import { formatNotionDateTime } from './format-notion-date-time'

// A negative UTC offset moves local midnight into the previous day and month.
const originalTimeZone = process.env.TZ

beforeAll(() => {
  process.env.TZ = 'America/Los_Angeles'
})

afterAll(() => {
  process.env.TZ = originalTimeZone
})

test('formatDate uses UTC for every date part', () => {
  expect(formatDate('2022-08-01')).toBe('Aug 1, 2022')
  expect(formatDate('2022-01-01')).toBe('Jan 1, 2022')
  expect(formatDate('2022-01-01', { month: 'long' })).toBe('January 1, 2022')
  expect(formatDate(Date.UTC(2022, 2, 1))).toBe('Mar 1, 2022')
})

test('formatNotionDateTime keeps the Notion start date', () => {
  expect(
    formatNotionDateTime({ type: 'datetime', start_date: '2022-08-01' })
  ).toBe('Aug 1, 2022')
})
