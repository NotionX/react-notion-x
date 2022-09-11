import { PageBlock } from 'notion-types'
import { getPagePropertyFromId } from 'notion-utils'
import * as React from 'react'
import { useNotionContext } from '../context'
import { DefaultPageIcon } from '../icons/default-page-icon'
import { CollectionViewProps } from '../types'
import { cs, getWeeksInMonth } from '../utils'
import { CollectionGroup } from './collection-group'
import { getCollectionGroups } from './collection-utils'
import { Property } from './property'

const defaultBlockIds = []
const currentYear = new Date(Date.now())
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
let currentMonth = 0

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
  const { showCalendarControls, components, recordMap, mapPageUrl } =
    useNotionContext()
  const [weeksArr, setWeeksArr] = React.useState(
    getWeeksInMonth(currentYear.getFullYear(), currentYear.getMonth())
  )

  const nextMonth = () => {
    if (currentYear.getMonth() == 11) {
      currentYear.setFullYear(currentYear.getFullYear() + 1)
      currentYear.setMonth(0)
    } else {
      currentYear.setMonth(currentYear.getMonth() + 1)
    }

    currentMonth = 0

    setWeeksArr(
      getWeeksInMonth(currentYear.getFullYear(), currentYear.getMonth())
    )
  }
  const prevMonth = () => {
    if (currentYear.getMonth() == 0) {
      currentYear.setFullYear(currentYear.getFullYear() - 1)
      currentYear.setMonth(11)
    } else {
      currentYear.setMonth(currentYear.getMonth() - 1)
    }

    currentMonth = 0

    setWeeksArr(
      getWeeksInMonth(currentYear.getFullYear(), currentYear.getMonth())
    )
  }
  const nowMonth = () => {
    currentYear.setMonth(new Date().getMonth())
    currentYear.setFullYear(new Date().getFullYear())

    currentMonth = 0

    setWeeksArr(
      getWeeksInMonth(currentYear.getFullYear(), currentYear.getMonth())
    )
  }

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
                <svg
                  viewBox='0 0 30 30'
                  className='notion-calendar-header-inner-controls-prev-svg'
                >
                  <polygon points='12.6 15 23 25.2 20.2 28 7 15 20.2 2 23 4.8'></polygon>
                </svg>
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
                <svg
                  viewBox='0 0 30 30'
                  className='notion-calendar-header-inner-controls-next-svg'
                >
                  <polygon points='17.4,15 7,25.2 9.8,28 23,15 9.8,2 7,4.8'></polygon>
                </svg>
              </div>
            </>
          )}
        </div>

        <div className='notion-calendar-header-days'>
          <div className='notion-calendar-header-days-day'>Sun</div>
          <div className='notion-calendar-header-days-day'>Mon</div>
          <div className='notion-calendar-header-days-day'>Tue</div>
          <div className='notion-calendar-header-days-day'>Wed</div>
          <div className='notion-calendar-header-days-day'>Thu</div>
          <div className='notion-calendar-header-days-day'>Fri</div>
          <div className='notion-calendar-header-days-day'>Sat</div>
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
            className='notion-calendar-body-inner'
            style={{
              height: `${
                collectionView.format?.calendar_properties &&
                Object.keys(collectionView.format?.calendar_properties).length *
                  20 +
                  64
              }px`
            }}
            key={indexI}
          >
            {i.dates.map((day, indexY) => (
              <>
                <div
                  className={cs(
                    'notion-selectable',
                    'notion-calendar-body-inner-week',
                    indexY == 0 || indexY == 6
                      ? 'notion-calendar-body-inner-week-dif'
                      : ''
                  )}
                  key={indexY}
                >
                  <div
                    className={cs(
                      'notion-calendar-body-inner-day',
                      day == new Date(Date.now()).getDate() &&
                        currentYear.getMonth() ==
                          new Date(Date.now()).getMonth() &&
                        currentYear.getFullYear() ==
                          new Date(Date.now()).getFullYear()
                        ? 'notion-calendar-body-inner-day-today'
                        : (day == 1 && currentMonth++ == 0) ||
                          ((day <= 31 || day >= 28) && currentMonth == 1)
                        ? 'notion-calendar-body-inner-day-this-month'
                        : 'notion-calendar-body-inner-day-other-month'
                    )}
                  >
                    {day == 1
                      ? `${
                          monthsShort[currentYear.getMonth() + currentMonth - 1]
                        } ${day}`
                      : day}
                  </div>
                </div>

                {blockIds?.map((blockId) => {
                  const block = recordMap.block[blockId]?.value as PageBlock
                  if (!block) return null

                  // Get date from calendar view query
                  const blockDate = getPagePropertyFromId(
                    collectionView.query2.calendar_by,
                    block,
                    recordMap
                  )

                  const titleSchema = collection.schema.title
                  const titleData = block?.properties?.title

                  if (
                    new Date(blockDate as number).getDate() == day &&
                    new Date(blockDate as number).getMonth() ==
                      currentYear.getMonth() &&
                    new Date(blockDate as number).getFullYear() ==
                      currentYear.getFullYear()
                  ) {
                    return (
                      <div
                        className='notion-calendar-body-inner-card'
                        style={{
                          left: `calc(${
                            new Date(blockDate as number).getDay() == 0
                              ? 0
                              : new Date(blockDate as number).getDay() * 14.2857
                          }%)`,
                          height: `${
                            collectionView.format?.calendar_properties &&
                            Object.keys(
                              collectionView.format?.calendar_properties
                            ).length *
                              20 +
                              30
                          }px`
                        }}
                        key={blockId}
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
                            <div
                              style={{
                                position: 'absolute',
                                top: '0px',
                                left: '-4px',
                                height: '100%',
                                width: '12px',
                                cursor: 'col-resize'
                              }}
                            ></div>
                            <div
                              style={{
                                position: 'absolute',
                                top: '0px',
                                right: '-4px',
                                height: '100%',
                                width: '12px',
                                cursor: 'col-resize'
                              }}
                            ></div>
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
