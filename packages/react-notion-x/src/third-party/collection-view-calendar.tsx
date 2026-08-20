import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  startOfWeek,
  subMonths
} from 'date-fns'
import { type PageBlock } from 'notion-types'
import { getDateValue } from 'notion-utils'
import React from 'react'

import { useNotionContext } from '../context'
import { type CollectionViewProps } from '../types'
import { CalendarWeekRow } from './collection-week-row'

const defaultBlockIds: string[] = []

export function CollectionViewCalendar({
  collection,
  collectionView,
  collectionData
}: CollectionViewProps) {
  const { recordMap } = useNotionContext()
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const blockIds =
    (collectionData.collection_group_results?.blockIds ??
      collectionData.blockIds) ||
    defaultBlockIds

  const datePropertyId = React.useMemo(() => {
    const calendarBy = (collectionView as any)?.query2?.calendar_by
    if (calendarBy) {
      const schema = collection.schema
      const propertySchema = schema[calendarBy]
      if (propertySchema && propertySchema.type === 'date') {
        return calendarBy
      }
    }

    const schema = collection.schema
    for (const [propertyId, propertySchema] of Object.entries(schema)) {
      if (propertySchema.type === 'date') {
        return propertyId
      }
    }
    return null
  }, [collection.schema, collectionView])

  const eventsByDate = React.useMemo(() => {
    const eventsMap = new Map<
      string,
      Array<{ block: PageBlock; dateRange: { start: Date; end: Date } | null }>
    >()

    if (!datePropertyId) {
      return eventsMap
    }

    for (const blockId of blockIds) {
      const block = recordMap.block[blockId]?.value as PageBlock
      if (!block) continue

      const dateProperty =
        block.properties?.[datePropertyId as keyof typeof block.properties]
      if (!dateProperty) continue

      const dateValue = getDateValue(dateProperty as any[])
      if (!dateValue) continue

      let startDate: Date
      let endDate: Date | null = null
      let dateRange: { start: Date; end: Date } | null = null

      if (dateValue.type === 'date' || dateValue.type === 'datetime') {
        startDate = new Date(dateValue.start_date)
        endDate = null
      } else if (
        dateValue.type === 'daterange' ||
        dateValue.type === 'datetimerange'
      ) {
        startDate = new Date(dateValue.start_date)
        endDate = dateValue.end_date ? new Date(dateValue.end_date) : null
        if (endDate) {
          dateRange = { start: startDate, end: endDate }
        }
      } else {
        continue
      }

      if (dateRange && endDate) {
        const allDays = eachDayOfInterval({
          start: startDate,
          end: endDate
        })
        for (const day of allDays) {
          const dateKey = format(day, 'yyyy-MM-dd')
          if (!eventsMap.has(dateKey)) {
            eventsMap.set(dateKey, [])
          }
          eventsMap.get(dateKey)!.push({ block, dateRange })
        }
      } else {
        const dateKey = format(startDate, 'yyyy-MM-dd')
        if (!eventsMap.has(dateKey)) {
          eventsMap.set(dateKey, [])
        }
        eventsMap.get(dateKey)!.push({ block, dateRange: null })
      }
    }

    return eventsMap
  }, [blockIds, datePropertyId, recordMap])

  const calendarDays = React.useMemo(() => {
    const weekStartsOn = 1 as 0 | 1 | 2 | 3 | 4 | 5 | 6
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn })
    const calendarEnd = startOfWeek(monthEnd, { weekStartsOn })
    const endDate = new Date(calendarEnd)
    endDate.setDate(endDate.getDate() + 6)

    return eachDayOfInterval({
      start: calendarStart,
      end: endDate
    })
  }, [currentMonth])

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const today = new Date()

  const weeks = React.useMemo(() => {
    const weekArray: Date[][] = []
    for (let i = 0; i < calendarDays.length; i += 7) {
      weekArray.push(calendarDays.slice(i, i + 7))
    }
    return weekArray
  }, [calendarDays])

  return (
    <div className='notion-calendar-collection'>
      <div className='notion-calendar-view'>
        <div className='notion-calendar-header'>
          <div className='notion-calendar-header-title'>
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <div className='notion-calendar-header-controls'>
            <div className='notion-calendar-header-nav'>
              <button
                type='button'
                className='notion-calendar-nav-button'
                onClick={goToPreviousMonth}
                aria-label='Previous month'
              >
                ‹
              </button>
              <button
                type='button'
                className='notion-calendar-nav-today-button'
                onClick={goToToday}
                aria-label='Today'
              >
                Today
              </button>
              <button
                type='button'
                className='notion-calendar-nav-button'
                onClick={goToNextMonth}
                aria-label='Next month'
              >
                ›
              </button>
            </div>
          </div>
        </div>
        <div className='notion-calendar-grid'>
          <div className='notion-calendar-weekdays'>
            {Array.from({ length: 7 }, (_, i) => {
              const dayIndex = (i + 1) % 7
              const date = new Date(2024, 0, 7 + dayIndex)
              const dayName = format(date, 'EEEEEE')
              return (
                <div key={i} className='notion-calendar-weekday'>
                  {dayName}
                </div>
              )
            })}
          </div>
          <div className='notion-calendar-weeks'>
            {weeks.map((weekDays, weekIndex) => (
              <CalendarWeekRow
                key={weekIndex}
                weekIndex={weekIndex}
                weekDays={weekDays}
                calendarDays={calendarDays}
                eventsByDate={eventsByDate}
                collection={collection}
                collectionView={collectionView}
                datePropertyId={datePropertyId}
                currentMonth={currentMonth}
                today={today}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
