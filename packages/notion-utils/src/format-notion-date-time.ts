import { formatDate } from './format-date'

export interface NotionDateTime {
  type: 'datetime'
  start_date: string
  start_time?: string
  time_zone?: string
}

export const formatNotionDateTime = (datetime: NotionDateTime) => {
  const dateString = `${datetime.start_time || ''} ${datetime.start_date} ${
    datetime.time_zone || ''
  }`
  return formatDate(dateString)
}
