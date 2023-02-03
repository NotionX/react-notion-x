import * as React from 'react'

import { PageBlock } from 'notion-types'
import { getPagePropertyFromId } from 'notion-utils'

import { useNotionContext } from '../context'
import { DefaultPageIcon } from '../icons/default-page-icon'
import SvgLeftChevron from '../icons/left-chevron'
import SvgRightChevron from '../icons/right-chevron'
import { CollectionViewProps } from '../types'
import { cs, getWeeksInMonth } from '../utils'
import { CollectionGroup } from './collection-group'
import { getCollectionGroups } from './collection-utils'
import { Property } from './property'

const defaultBlockIds = []
const currentYear = new Date()
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

const monthsShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export const CollectionViewCalendar: React.FC<CollectionViewProps> = ({
  collection,
  collectionView,
  collectionData
}) => {
  const isGroupedCollection = collectionView?.format?.collection_group_by

  if (isGroupedCollection) {
    const collectionGroups = getCollectionGroups(
      collection,
      collectionView,
      collectionData
    )

    return collectionGroups.map((group, index) => (
      <CollectionGroup
        key={index}
        {...group}
        collectionViewComponent={Calendar}
      />
    ))
  }

  const blockIds =
    (collectionData['collection_group_results']?.blockIds ??
      collectionData['results:relation:uncategorized']?.blockIds ??
      collectionData.blockIds) ||
    defaultBlockIds

  return (
    <Calendar
      collectionView={collectionView}
      collection={collection}
      blockIds={blockIds}
    />
  )
}

function Calendar({ blockIds, collectionView, collection }) {
  const {
    showCalendarControls,
    startWeekOnMonday,
    components,
    recordMap,
    mapPageUrl
  } = useNotionContext()

  const [currentMonth, setCurrentMonth] = React.useState(0)
  const [weeksArr, setWeeksArr] = React.useState(
    getWeeksInMonth(
      currentYear.getFullYear(),
      currentYear.getMonth(),
      startWeekOnMonday
    )
  )

  const nextMonth = () => {
    if (currentYear.getMonth() == 11) {
      currentYear.setFullYear(currentYear.getFullYear() + 1)
      currentYear.setMonth(0)
    } else {
      currentYear.setMonth(currentYear.getMonth() + 1)
    }

    setCurrentMonth(0)

    setWeeksArr(
      getWeeksInMonth(
        currentYear.getFullYear(),
        currentYear.getMonth(),
        startWeekOnMonday
      )
    )
  }
  const prevMonth = () => {
    if (currentYear.getMonth() == 0) {
      currentYear.setFullYear(currentYear.getFullYear() - 1)
      currentYear.setMonth(11)
    } else {
      currentYear.setMonth(currentYear.getMonth() - 1)
    }

    setCurrentMonth(0)

    setWeeksArr(
      getWeeksInMonth(
        currentYear.getFullYear(),
        currentYear.getMonth(),
        startWeekOnMonday
      )
    )
  }
  const nowMonth = () => {
    currentYear.setMonth(new Date().getMonth())
    currentYear.setFullYear(new Date().getFullYear())

    setCurrentMonth(0)

    setWeeksArr(
      getWeeksInMonth(
        currentYear.getFullYear(),
        currentYear.getMonth(),
        startWeekOnMonday
      )
    )
  }

  const checkWeek = (weekNumber: number) => {
    let max = 0

    for (let i = 0; i < 7; i++) {
      const newMax = getPagesThisDay(weeksArr[weekNumber][i]).length
      if (max < newMax) max = newMax
    }

    return max
  }

  const getPagesThisDay = (day: { date: number; month: number }) => {
    const daysTo = []

    blockIds?.map((blockId) => {
      const block = recordMap.block[blockId]?.value as PageBlock
      if (!block) return null

      // Get date from calendar view query
      const blockDate = getPagePropertyFromId(
        collectionView.query2.calendar_by,
        block,
        recordMap
      )
      const blockDateDATE = new Date(blockDate as number)
      if (
        blockDateDATE.getDate() == day.date &&
        blockDateDATE.getMonth() == day.month &&
        blockDateDATE.getFullYear() == currentYear.getFullYear()
      ) {
        daysTo.push(block)
      }
    })

    return daysTo
  }

  // Check if collection view is a standalone page or not
  const isCollectionViewPage =
    recordMap.block[Object.keys(recordMap.block)[0]].value.type ===
    'collection_view_page'

  // This is needed because calendar view pages need to be full width (like Notion)
  React.useEffect(() => {
    if (isCollectionViewPage) {
      document.querySelector('.notion-page').classList.add('notion-full-width')
    }
  }, [])

  return (
    <div className='notion-calendar-view'>
      <div className='notion-calendar-header'>
        <div className='notion-calendar-header-inner'>
          <div className='notion-calendar-header-inner-date'>
            {months[currentYear.getMonth()] + ' ' + currentYear.getFullYear()}
          </div>

          <div
            style={{
              flexGrow: 1
            }}
          ></div>

          {showCalendarControls && (
            <>
              <div
                className={cs(
                  'notion-focusable',
                  'notion-calendar-header-inner-controls-prev'
                )}
                role='button'
                tabIndex={0}
                onClick={prevMonth}
              >
                <SvgLeftChevron className='notion-calendar-header-inner-controls-prev-svg' />
              </div>

              <div
                className={cs(
                  'notion-focusable',
                  'notion-calendar-header-inner-controls-today'
                )}
                role='button'
                tabIndex={0}
                onClick={nowMonth}
              >
                Today
              </div>
              <div
                className={cs(
                  'notion-focusable',
                  'notion-calendar-header-inner-controls-next'
                )}
                role='button'
                tabIndex={0}
                onClick={nextMonth}
              >
                <SvgRightChevron className='notion-calendar-header-inner-controls-next-svg' />
              </div>
            </>
          )}
        </div>

        <div className='notion-calendar-header-days'>
          {startWeekOnMonday ? (
            <>
              <div className='notion-calendar-header-days-day'>Mon</div>
              <div className='notion-calendar-header-days-day'>Tue</div>
              <div className='notion-calendar-header-days-day'>Wed</div>
              <div className='notion-calendar-header-days-day'>Thu</div>
              <div className='notion-calendar-header-days-day'>Fri</div>
              <div className='notion-calendar-header-days-day'>Sat</div>
              <div className='notion-calendar-header-days-day'>Sun</div>
            </>
          ) : (
            <>
              <div className='notion-calendar-header-days-day'>Sun</div>
              <div className='notion-calendar-header-days-day'>Mon</div>
              <div className='notion-calendar-header-days-day'>Tue</div>
              <div className='notion-calendar-header-days-day'>Wed</div>
              <div className='notion-calendar-header-days-day'>Thu</div>
              <div className='notion-calendar-header-days-day'>Fri</div>
              <div className='notion-calendar-header-days-day'>Sat</div>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          height: '66px'
        }}
      ></div>

      <div className='notion-calendar-body'>
        {weeksArr.map((i, indexI) => (
          <div
            className={cs(
              'notion-calendar-body-inner',
              weeksArr.length - 1 == indexI &&
                'notion-calendar-body-inner-last-week'
            )}
            style={{
              /*height: `${
                collectionView.format?.calendar_properties &&
                Object.keys(collectionView.format?.calendar_properties).length *
                  20 +
                  64
              }px`*/
              height: `${
                checkWeek(indexI) == 0 ? 143.99 : checkWeek(indexI) * 110 + 34
              }px`
            }}
            key={indexI}
          >
            {i.map((day, indexY: number) => (
              <>
                <div
                  className={cs(
                    'notion-selectable',
                    'notion-calendar-body-inner-week',
                    startWeekOnMonday
                      ? indexY == 5 || indexY == 6
                        ? 'notion-calendar-body-inner-week-dif'
                        : ''
                      : indexY == 0 || indexY == 6
                      ? 'notion-calendar-body-inner-week-dif'
                      : ''
                  )}
                  key={indexY}
                >
                  <div
                    className={cs(
                      'notion-calendar-body-inner-day',

                      day.date == new Date().getDate() &&
                        day.month == new Date().getMonth() &&
                        currentYear.getFullYear() == new Date().getFullYear()
                        ? 'notion-calendar-body-inner-day-today'
                        : (day.date == 1 &&
                            currentYear.getMonth() == day.month) ||
                          ((day.date <= 31 || day.date >= 28) &&
                            currentYear.getMonth() == day.month)
                        ? 'notion-calendar-body-inner-day-this-month'
                        : 'notion-calendar-body-inner-day-other-month'
                    )}
                  >
                    {day.date == 1
                      ? `${monthsShort[day.month + currentMonth]} ${day.date}`
                      : day.date}
                  </div>
                </div>

                {getPagesThisDay(day).map((block, sum) => {
                  // Get date from calendar view query
                  const blockDate = getPagePropertyFromId(
                    collectionView.query2.calendar_by,
                    block,
                    recordMap
                  )
                  const blockDateDATE = new Date(blockDate as number)
                  const dayBlock = startWeekOnMonday
                    ? blockDateDATE.getDay() === 0
                      ? 6
                      : blockDateDATE.getDay() - 1
                    : blockDateDATE.getDay()

                  const titleSchema = collection.schema.title
                  const titleData = block?.properties?.title

                  if (
                    blockDateDATE.getDate() == day.date &&
                    blockDateDATE.getMonth() == day.month &&
                    blockDateDATE.getFullYear() == currentYear.getFullYear()
                  ) {
                    return (
                      <div
                        className='notion-calendar-body-inner-card'
                        style={{
                          left: `calc(${
                            dayBlock == 0 ? 0 : dayBlock * 14.2857
                          }%)`,
                          height: `${
                            collectionView.format?.calendar_properties &&
                            Object.keys(
                              collectionView.format?.calendar_properties
                            ).length *
                              20 +
                              30
                          }px`,
                          top: `${
                            (checkWeek(indexI) != 0 ? sum * 110 : 0) + 30
                          }px`
                        }}
                        key={block.id}
                      >
                        <components.PageLink
                          href={mapPageUrl(block.id)}
                          className='notion-calendar-body-inner-card-inner'
                        >
                          <div className='notion-calendar-body-inner-card-inner-box'>
                            <div className='notion-calendar-body-inner-card-inner-box-title'>
                              <div className='notion-calendar-body-inner-card-inner-box-title-inner'>
                                <div className='notion-calendar-body-inner-card-inner-box-title-inner-icon'>
                                  <DefaultPageIcon className='notion-calendar-body-inner-card-inner-box-title-inner-icon-svg' />
                                </div>
                                <div className='notion-calendar-body-inner-card-inner-box-title-inner-text'>
                                  <Property
                                    schema={titleSchema}
                                    data={titleData}
                                    block={block}
                                    collection={collection}
                                    linkToTitlePage={false}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='notion-calendar-body-inner-card-inner-box-properties'>
                              {collectionView.format?.calendar_properties
                                ?.filter((p) => p.visible)
                                .map((p, z) => {
                                  const schema = collection.schema[p.property]
                                  const data =
                                    block && block.properties?.[p.property]

                                  if (!schema) {
                                    return null
                                  }

                                  return (
                                    <div
                                      className='notion-calendar-body-inner-card-inner-box-properties-property'
                                      key={z}
                                    >
                                      <Property
                                        schema={schema}
                                        data={data}
                                        block={block}
                                        collection={collection}
                                        longMonth={true}
                                      />
                                    </div>
                                  )
                                })}
                            </div>
                          </div>
                        </components.PageLink>
                      </div>
                    )
                  }

                  return null
                })}
              </>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
