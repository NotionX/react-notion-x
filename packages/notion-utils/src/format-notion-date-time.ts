import { getNotionDateTime } from './get-notion-date-time'
import { formatDate } from './format-date'

export interface NotionDateTime {
  type: 'datetime'
  start_date: string
  start_time?: string
  time_zone?: string
}

export const formatNotionDateTime = (datetime: NotionDateTime) => {
  const date = getNotionDateTime(
    datetime.start_date,
    datetime.start_time,
    datetime.time_zone
  )

  return formatDate(date)
}
