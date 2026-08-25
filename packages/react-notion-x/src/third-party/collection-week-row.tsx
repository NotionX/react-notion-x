import { format, getDay, isSameDay, isSameMonth } from 'date-fns'
import { type PageBlock } from 'notion-types'
import React from 'react'

import { cs } from '../utils'
import { CollectionCard } from './collection-card'

const CARD_GAP = 8
const CARD_HORIZONTAL_PADDING = 4
const DAY_BORDER_WIDTH = 1

export function CalendarWeekRow({
  weekIndex,
  weekDays,
  calendarDays,
  eventsByDate,
  collection,
  collectionView,
  datePropertyId,
  currentMonth,
  today
}: {
  weekIndex: number
  weekDays: Date[]
  calendarDays: Date[]
  eventsByDate: Map<
    string,
    Array<{ block: PageBlock; dateRange: { start: Date; end: Date } | null }>
  >
  collection: any
  collectionView: any
  datePropertyId: string | null
  currentMonth: Date
  today: Date
}) {
  const weekRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<Map<string, HTMLDivElement>>(new Map())
  const [weekHeight, setWeekHeight] = React.useState(140)
  const [dayWidths, setDayWidths] = React.useState<number[]>([])
  const [cardHeights, setCardHeights] = React.useState<Map<string, number>>(
    new Map()
  )

  const propertiesSource =
    collectionView.format?.calendar_properties ||
    collectionView.format?.list_properties ||
    []

  const visibleProperties = propertiesSource.filter(
    (p: any) =>
      p.visible === true &&
      p.property !== 'title' &&
      (datePropertyId ? p.property !== datePropertyId : true)
  )

  const calendarCover = (collectionView.format as any)?.calendar_cover || {
    type: 'none'
  }

  const calendarCoverSize =
    (collectionView.format as any)?.calendar_cover_size || 'small'
  const calendarCoverAspect =
    (collectionView.format as any)?.calendar_cover_aspect || 'cover'

  const MULTIDAY_CARD_MIN_HEIGHT = 44
  const CARD_TOP_OFFSET = 48

  const { eventsWithAdjustedWidth: allEventsWithWidth, layersPerDay } =
    React.useMemo(() => {
      const events: Array<{
        block: PageBlock
        dateRange: { start: Date; end: Date } | null
        startIndex: number
        endIndex: number
        displayStartIndex: number
        displayEndIndex: number
        displayStartDayIndex: number
        displayEndDayIndex: number
        layerIndex: number
        isStartDay: boolean
        isEndDay: boolean
        startDateKey: string
        endDateKey: string
        dateKey: string
        globalIndex: number
        dayIndexInWeek: number
      }> = []

      const allEvents: Array<{
        block: PageBlock
        dateRange: { start: Date; end: Date } | null
        startIndex: number
        endIndex: number
        displayStartIndex: number
        displayEndIndex: number
        displayStartDayIndex: number
        displayEndDayIndex: number
        isStartDay: boolean
        isEndDay: boolean
        startDateKey: string
        endDateKey: string
        dateKey: string
        globalIndex: number
        dayIndexInWeek: number
      }> = []

      for (const [dayIndexInWeek, day] of weekDays.entries()) {
        const globalIndex = weekIndex * 7 + dayIndexInWeek
        const dateKey = format(day, 'yyyy-MM-dd')
        const dayEvents = eventsByDate.get(dateKey) || []

        for (const event of dayEvents) {
          const { block, dateRange } = event

          const startDate = dateRange ? dateRange.start : new Date(day)
          const endDate = dateRange ? dateRange.end : new Date(day)
          const startDateKey = format(startDate, 'yyyy-MM-dd')
          const endDateKey = format(endDate, 'yyyy-MM-dd')

          const isInRange = dateKey >= startDateKey && dateKey <= endDateKey
          if (!isInRange) continue

          const startIndex = calendarDays.findIndex((d) =>
            isSameDay(d, startDate)
          )
          const endIndex = calendarDays.findIndex((d) => isSameDay(d, endDate))
          if (startIndex === -1 || endIndex === -1) continue

          const isStartDay = dateKey === startDateKey

          const currentWeekIndex = Math.floor(globalIndex / 7)
          const weekStartIndex = currentWeekIndex * 7
          const weekEndIndex = weekStartIndex + 6

          const isWeekStart = globalIndex === weekStartIndex
          const shouldRenderCard =
            isStartDay ||
            (isWeekStart &&
              startIndex < weekStartIndex &&
              globalIndex <= endIndex)

          if (!shouldRenderCard) continue

          let displayStartIndex: number
          let displayEndIndex: number

          if (isStartDay) {
            displayStartIndex = startIndex
            displayEndIndex = Math.min(endIndex, weekEndIndex)
          } else {
            displayStartIndex = Math.max(startIndex, weekStartIndex)
            displayEndIndex = Math.min(endIndex, weekEndIndex)
          }

          const spanDays = displayEndIndex - displayStartIndex + 1
          if (spanDays <= 0) continue

          const displayStartDayIndex = displayStartIndex - weekStartIndex
          const isEndDay = dateKey === endDateKey
          const displayEndDayIndex = displayEndIndex - weekStartIndex

          allEvents.push({
            block,
            dateRange: dateRange || null,
            startIndex,
            endIndex,
            displayStartIndex,
            displayEndIndex,
            displayStartDayIndex,
            displayEndDayIndex,
            isStartDay,
            isEndDay,
            startDateKey,
            endDateKey,
            dateKey,
            globalIndex,
            dayIndexInWeek
          })
        }
      }

      const sortedEvents = [...allEvents].toSorted((a, b) => {
        const durationA = a.displayEndIndex - a.displayStartIndex
        const durationB = b.displayEndIndex - b.displayStartIndex
        if (durationA !== durationB) {
          return durationB - durationA
        }
        if (a.displayStartIndex !== b.displayStartIndex) {
          return a.displayStartIndex - b.displayStartIndex
        }
        return a.displayEndIndex - b.displayEndIndex
      })

      const dayLayerAssignments: Array<Array<(typeof allEvents)[0] | null>> =
        Array.from(
          { length: 7 },
          () => [] as Array<(typeof allEvents)[0] | null>
        )
      const layersPerDay = Array.from({ length: 7 }).fill(0)

      for (const event of sortedEvents) {
        const spanStart = Math.max(0, event.displayStartDayIndex)
        const spanEnd = Math.min(6, event.displayEndDayIndex)
        let layerIndex = 0

        while (true) {
          const canUseLayer = (() => {
            for (let dayIndex = spanStart; dayIndex <= spanEnd; dayIndex++) {
              const dayLayers = dayLayerAssignments[dayIndex]
              if (dayLayers && dayLayers[layerIndex]) {
                return false
              }
            }
            return true
          })()

          if (canUseLayer) {
            for (let dayIndex = spanStart; dayIndex <= spanEnd; dayIndex++) {
              const dayLayers = dayLayerAssignments[dayIndex]
              if (dayLayers) {
                dayLayers[layerIndex] = event
                layersPerDay[dayIndex] = Math.max(
                  layersPerDay[dayIndex],
                  layerIndex + 1
                )
              }
            }
            break
          }

          layerIndex += 1
        }

        events.push({
          ...event,
          layerIndex
        })
      }

      const eventsWithAdjustedWidth: Array<
        (typeof events)[0] & {
          width: number
          left: number
          leftPadding: number
          rightPadding: number
          continuesIntoNextWeek: boolean
          continuesFromPreviousWeek: boolean
        }
      > = []

      for (const event of events) {
        let totalWidth = 0
        const displayStartDate = calendarDays[event.displayStartIndex]
        const displayEndDate = calendarDays[event.displayEndIndex]
        const startDayOfWeek = displayStartDate
          ? getDay(displayStartDate)
          : null
        const endDayOfWeek = displayEndDate ? getDay(displayEndDate) : null

        const continuesFromPreviousWeek =
          !event.isStartDay && startDayOfWeek === 1
        const continuesIntoNextWeek = !event.isEndDay && endDayOfWeek === 0

        let leftPadding = CARD_HORIZONTAL_PADDING
        let rightPadding = CARD_HORIZONTAL_PADDING

        if (continuesFromPreviousWeek) {
          leftPadding = 0
        }

        if (continuesIntoNextWeek) {
          rightPadding = 0
        }

        if (dayWidths.length === 7) {
          const spanDays = event.displayEndIndex - event.displayStartIndex + 1
          for (let i = 0; i < spanDays; i++) {
            const dayIndex = event.displayStartDayIndex + i
            if (dayIndex >= 0 && dayIndex < 7) {
              totalWidth += dayWidths[dayIndex] || 0
            }
          }
          totalWidth -= leftPadding + rightPadding
        } else {
          const spanDays = event.displayEndIndex - event.displayStartIndex + 1
          totalWidth = spanDays * (100 / 7) - (leftPadding + rightPadding)
        }

        let startLeft = leftPadding
        if (dayWidths.length === 7) {
          for (let i = 0; i < event.displayStartDayIndex; i++) {
            startLeft += dayWidths[i] || 0
          }
        } else {
          startLeft = event.displayStartDayIndex * (100 / 7)
        }

        eventsWithAdjustedWidth.push({
          ...event,
          width: totalWidth,
          left: startLeft,
          leftPadding,
          rightPadding,
          continuesIntoNextWeek,
          continuesFromPreviousWeek
        })
      }

      return { eventsWithAdjustedWidth, layersPerDay }
    }, [weekDays, weekIndex, eventsByDate, calendarDays, dayWidths])

  const getEventCardKey = React.useCallback(
    (event: {
      block: PageBlock
      globalIndex: number
      displayStartIndex: number
      layerIndex: number
    }) => {
      return `event-${event.block.id}-${event.globalIndex}-${event.displayStartIndex}-${event.layerIndex}`
    },
    []
  )

  const layerHeights = React.useMemo(() => {
    const heights = new Map<number, number>()

    for (const event of allEventsWithWidth) {
      const cardKey = getEventCardKey(event)
      const cardHeight = cardHeights.get(cardKey) || MULTIDAY_CARD_MIN_HEIGHT
      const prevHeight = heights.get(event.layerIndex) || 0

      if (cardHeight > prevHeight) {
        heights.set(event.layerIndex, cardHeight)
      }
    }

    return heights
  }, [allEventsWithWidth, cardHeights, getEventCardKey])

  const layerOffsets = React.useMemo(() => {
    const offsets = new Map<number, number>()
    let cumulativeOffset = CARD_TOP_OFFSET

    const sortedLayers = Array.from(layerHeights.keys()).toSorted(
      (a, b) => a - b
    )

    for (const layerIndex of sortedLayers) {
      offsets.set(layerIndex, cumulativeOffset)
      const height = layerHeights.get(layerIndex) || MULTIDAY_CARD_MIN_HEIGHT
      cumulativeOffset += height + CARD_GAP
    }

    return offsets
  }, [layerHeights])

  React.useEffect(() => {
    const measureCardHeights = () => {
      const heights = new Map<string, number>()

      for (const [key, cardElement] of cardRefs.current.entries()) {
        if (cardElement) {
          const collectionCard = cardElement.querySelector(
            '.notion-calendar-event-card'
          ) as HTMLElement

          if (collectionCard) {
            const rect = collectionCard.getBoundingClientRect()
            if (rect.height > 0) {
              heights.set(key, rect.height)
            }
          } else {
            const rect = cardElement.getBoundingClientRect()
            if (rect.height > 0) {
              heights.set(key, rect.height)
            }
          }
        }
      }

      if (heights.size > 0) {
        setCardHeights((prevHeights) => {
          let hasChanges = false
          for (const [key, height] of heights.entries()) {
            if (prevHeights.get(key) !== height) {
              hasChanges = true
            }
          }
          if (!hasChanges && heights.size === prevHeights.size) {
            return prevHeights
          }
          return new Map(heights)
        })
      }
    }

    const timeoutId1 = setTimeout(() => {
      measureCardHeights()
    }, 0)

    const timeoutId2 = setTimeout(() => {
      measureCardHeights()
    }, 50)

    const timeoutId3 = setTimeout(() => {
      measureCardHeights()
    }, 100)

    const resizeObserver = new ResizeObserver(() => {
      measureCardHeights()
    })

    for (const cardElement of cardRefs.current) {
      if (cardElement && cardElement instanceof Element) {
        resizeObserver.observe(cardElement)

        const collectionCard = cardElement.querySelector(
          '.notion-calendar-event-card'
        ) as HTMLElement
        if (collectionCard && collectionCard instanceof Element) {
          resizeObserver.observe(collectionCard)
        }
      }
    }

    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
      clearTimeout(timeoutId3)
      resizeObserver.disconnect()
    }
  }, [allEventsWithWidth])

  React.useEffect(() => {
    if (!weekRef.current) return

    const measureDayWidths = () => {
      const weekElement = weekRef.current
      if (!weekElement) return

      const dayElements = weekElement.querySelectorAll('.notion-calendar-day')
      const widths: number[] = []

      for (const dayElement of dayElements) {
        const rect = dayElement.getBoundingClientRect()
        widths.push(rect.width)
      }

      if (widths.length === 7) {
        setDayWidths(widths)
      }
    }

    const timeoutId = setTimeout(() => {
      measureDayWidths()
    }, 0)

    const resizeObserver = new ResizeObserver(() => {
      measureDayWidths()
    })

    if (weekRef.current) resizeObserver.observe(weekRef.current)

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
    }
  }, [weekDays])

  React.useEffect(() => {
    if (!weekRef.current) return

    const measureWeekHeight = () => {
      const weekElement = weekRef.current
      if (!weekElement) return

      const allCards = weekElement.querySelectorAll(
        '.notion-calendar-event-card-wrapper'
      )

      if (allCards.length === 0) {
        setWeekHeight(140)
        return
      }

      let maxBottom = 0

      for (const card of allCards) {
        const cardElement = card as HTMLElement
        const weekRect = weekElement.getBoundingClientRect()
        const wrapperRect = cardElement.getBoundingClientRect()
        const relativeTop = wrapperRect.top - weekRect.top

        const collectionCard = cardElement.querySelector(
          '.notion-calendar-event-card'
        ) as HTMLElement

        let cardHeight = wrapperRect.height
        if (collectionCard) {
          const cardRect = collectionCard.getBoundingClientRect()
          cardHeight = cardRect.height
        }

        const cardBottom = relativeTop + cardHeight

        if (cardBottom > maxBottom) {
          maxBottom = cardBottom
        }
      }

      const calculatedHeight = Math.max(140, maxBottom + 8)
      setWeekHeight(calculatedHeight)
    }

    const timeoutId = setTimeout(() => {
      measureWeekHeight()
    }, 0)

    const resizeObserver = new ResizeObserver(() => {
      measureWeekHeight()

      const heights = new Map<string, number>()
      for (const [key, cardElement] of cardRefs.current.entries()) {
        if (cardElement) {
          const collectionCard = cardElement.querySelector(
            '.notion-calendar-event-card'
          ) as HTMLElement

          if (collectionCard) {
            const rect = collectionCard.getBoundingClientRect()
            if (rect.height > 0) {
              heights.set(key, rect.height)
            }
          } else {
            const rect = cardElement.getBoundingClientRect()
            if (rect.height > 0) {
              heights.set(key, rect.height)
            }
          }
        }
      }
      if (heights.size > 0) {
        setCardHeights(heights)
      }
    })

    const allCards = weekRef.current.querySelectorAll(
      '.notion-calendar-event-card-wrapper'
    )
    for (const card of allCards) {
      const cardElement = card as HTMLElement
      if (cardElement && cardElement instanceof Element) {
        resizeObserver.observe(cardElement)

        const collectionCard = cardElement.querySelector(
          '.notion-calendar-event-card'
        ) as HTMLElement
        if (collectionCard && collectionCard instanceof Element) {
          resizeObserver.observe(collectionCard)
        }
      }
    }

    if (weekRef.current) {
      resizeObserver.observe(weekRef.current)
    }

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
    }
  }, [weekDays, eventsByDate])

  return (
    <div
      ref={weekRef}
      className='notion-calendar-week-row'
      style={{
        position: 'relative',
        height: `${weekHeight}px`,
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        borderTop: '1px solid var(--fg-color-1)',
        borderLeft: '1px solid var(--fg-color-1)'
      }}
    >
      {weekDays.map((day, dayIndexInWeek) => {
        const globalIndex = weekIndex * 7 + dayIndexInWeek
        const isCurrentMonth = isSameMonth(day, currentMonth)
        const isToday = isSameDay(day, today)
        const layerCountForDay = layersPerDay[dayIndexInWeek] || 0

        return (
          <div
            key={globalIndex}
            className={cs(
              'notion-calendar-day',
              !isCurrentMonth && 'notion-calendar-day-other-month',
              isToday && 'notion-calendar-day-today'
            )}
            style={{
              borderRight: '1px solid var(--fg-color-1)',
              borderBottom: '1px solid var(--fg-color-1)',
              background: 'var(--bg-color)',
              position: 'relative',
              overflow: 'visible',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              boxSizing: 'border-box'
            }}
            data-layer-count={layerCountForDay}
          >
            <div className='notion-calendar-day-number'>{format(day, 'd')}</div>
            <div
              className='notion-calendar-day-events'
              style={{
                position: 'relative',
                flex: 1,
                overflow: 'visible'
              }}
            />
          </div>
        )
      })}

      {allEventsWithWidth.map((event) => {
        const displayStartDate = calendarDays[event.displayStartIndex]
        const displayEndDate = calendarDays[event.displayEndIndex]
        if (!displayStartDate || !displayEndDate) return null

        const nextDay = new Date(displayEndDate)
        nextDay.setDate(nextDay.getDate() + 1)

        const spanDays = event.displayEndIndex - event.displayStartIndex + 1
        const widthValue =
          dayWidths.length === 7
            ? `${event.width}px`
            : `calc(${spanDays} * (100% / 7) + ${
                (spanDays - 1) * DAY_BORDER_WIDTH
              }px - ${(event.leftPadding + event.rightPadding).toFixed(2)}px)`

        const leftValue =
          dayWidths.length === 7
            ? `${event.left}px`
            : `calc(${event.displayStartDayIndex} * ((100% / 7) + ${
                DAY_BORDER_WIDTH
              }px) + ${event.leftPadding.toFixed(2)}px)`

        const topOffset = layerOffsets.get(event.layerIndex)

        const cardKey = getEventCardKey(event)

        const eventCardStyle = {
          width: widthValue,
          position: 'absolute' as const,
          left: leftValue,
          top: `${topOffset}px`,
          zIndex: 100 + event.layerIndex,
          pointerEvents: 'auto' as const,
          height: 'auto',
          minHeight: `${MULTIDAY_CARD_MIN_HEIGHT}px`,
          boxSizing: 'border-box' as const
        }

        return (
          <div
            key={cardKey}
            ref={(el) => {
              if (el) {
                cardRefs.current.set(cardKey, el)
              } else {
                cardRefs.current.delete(cardKey)
              }
            }}
            className={cs('notion-calendar-event-card-wrapper')}
            style={eventCardStyle}
            data-layer-index={event.layerIndex}
            data-continuation={!event.isStartDay ? 'true' : undefined}
            data-start-day={event.isStartDay ? 'true' : undefined}
            data-end-day={event.isEndDay ? 'true' : undefined}
            data-continues-next-week={
              event.continuesIntoNextWeek ? 'true' : undefined
            }
            data-continues-from-prev-week={
              event.continuesFromPreviousWeek ? 'true' : undefined
            }
          >
            <CollectionCard
              collection={collection}
              block={event.block}
              cover={calendarCover}
              coverSize={calendarCoverSize}
              coverAspect={calendarCoverAspect}
              properties={visibleProperties}
              className={cs('notion-calendar-event-card')}
            />
          </div>
        )
      })}
    </div>
  )
}
