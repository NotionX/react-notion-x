import { PageBlock } from 'notion-types'
import { getPagePropertyFromId } from 'notion-utils'
import * as React from 'react'
import { useNotionContext } from '../context'
import { DefaultPageIcon } from '../icons/default-page-icon'
import { CollectionViewProps } from '../types'
import { getWeeksInMonth } from '../utils'
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
  const { components, recordMap, mapPageUrl } = useNotionContext()
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
    <div style={{ position: 'relative', paddingLeft: '1px' }}>
      <div
        style={{
          position: 'absolute',
          left: '0px',
          right: '0px',
          background: 'white',
          zIndex: 83
        }}
      >
        <div style={{ display: 'flex', height: '42px', alignItems: 'center' }}>
          <div
            style={{
              fontWeight: 600,
              marginLeft: '8px',
              marginRight: '8px',
              lineHeight: '1',
              fontSize: '14px'
            }}
          >
            {months[currentYear.getMonth()] + ' ' + currentYear.getFullYear()}
          </div>
          <div
            style={{
              flexGrow: 1
            }}
          ></div>
          <div
            className='notion-focusable'
            role='button'
            tabIndex={0}
            style={{
              userSelect: 'none',
              transition: 'background 20ms ease-in 0s',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderRadius: '3px',
              height: '24px',
              width: '24px',
              padding: '0px'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(55,53,47,0.08)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            onClick={prevMonth}
          >
            <svg
              viewBox='0 0 30 30'
              className='chevronLeft'
              style={{
                width: '14px',
                height: '14px',
                display: 'block',
                fill: 'rgba(55, 53, 47, 0.45)',
                flexShrink: 0,
                backfaceVisibility: 'hidden'
              }}
            >
              <polygon points='12.6 15 23 25.2 20.2 28 7 15 20.2 2 23 4.8'></polygon>
            </svg>
          </div>
          <div
            className='notion-focusable'
            role='button'
            tabIndex={0}
            style={{
              userSelect: 'none',
              transition: 'background 20ms ease-in 0s',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              height: '24px',
              borderRadius: '3px',
              fontSize: '14px',
              lineHeight: '1.2',
              minWidth: '0px',
              paddingLeft: '6px',
              paddingRight: '6px',
              color: 'rgb(55, 53, 47)'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(55,53,47,0.08)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            onClick={nowMonth}
          >
            Today
          </div>
          <div
            className='notion-focusable'
            role='button'
            tabIndex={0}
            style={{
              userSelect: 'none',
              transition: 'background 20ms ease-in 0s',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderRadius: '3px',
              height: '24px',
              width: '24px',
              padding: '0px'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(55,53,47,0.08)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = '')}
            onClick={nextMonth}
          >
            <svg
              viewBox='0 0 30 30'
              className='chevronRight'
              style={{
                width: '14px',
                height: '14px',
                display: 'block',
                fill: 'rgba(55, 53, 47, 0.45)',
                flexShrink: 0,
                backfaceVisibility: 'hidden'
              }}
            >
              <polygon points='17.4,15 7,25.2 9.8,28 23,15 9.8,2 7,4.8'></polygon>
            </svg>
          </div>
        </div>
        <div
          className='notion-calendar-header-days'
          style={{
            display: 'flex',
            marginTop: '0px',
            boxShadow: 'rgb(233 233 231) 0px 1px 0px'
          }}
        >
          <div
            style={{
              flexGrow: 1,
              flexBasis: '0px',
              textAlign: 'center',
              fontSize: '12px',
              height: '24px',
              color: 'rgba(55, 53, 47, 0.5)'
            }}
          >
            Sun
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '0px',
              textAlign: 'center',
              fontSize: '12px',
              height: '24px',
              color: 'rgba(55, 53, 47, 0.5)'
            }}
          >
            Mon
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '0px',
              textAlign: 'center',
              fontSize: '12px',
              height: '24px',
              color: 'rgba(55, 53, 47, 0.5)'
            }}
          >
            Tue
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '0px',
              textAlign: 'center',
              fontSize: '12px',
              height: '24px',
              color: 'rgba(55, 53, 47, 0.5)'
            }}
          >
            Wed
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '0px',
              textAlign: 'center',
              fontSize: '12px',
              height: '24px',
              color: 'rgba(55, 53, 47, 0.5)'
            }}
          >
            Thu
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '0px',
              textAlign: 'center',
              fontSize: '12px',
              height: '24px',
              color: 'rgba(55, 53, 47, 0.5)'
            }}
          >
            Fri
          </div>
          <div
            style={{
              flexGrow: 1,
              flexBasis: '0px',
              textAlign: 'center',
              fontSize: '12px',
              height: '24px',
              color: 'rgba(55, 53, 47, 0.5)'
            }}
          >
            Sat
          </div>
        </div>
      </div>

      <div
        style={{
          height: '66px'
        }}
      ></div>

      <div
        style={{
          boxShadow: 'rgb(233 233 231) -1px 0px 0px',
          marginTop: '1px',
          overflow: 'hidden'
        }}
      >
        {weeksArr.map((i, indexI) => (
          <div
            style={{
              position: 'relative',
              display: 'flex',
              height: `${
                Object.keys(collectionView.format?.calendar_properties).length *
                  20 +
                64
              }px`
            }}
            key={i.dates[indexI]}
          >
            {i.dates.map((day, indexY) => (
              <>
                <div
                  className='notion-selectable notion-collection_view-block'
                  style={{
                    position: 'relative',
                    flex: '1 0 0px',
                    borderRight: '1px solid rgb(233, 233, 231)',
                    borderBottom: '1px solid rgb(233, 233, 231)',
                    cursor: 'default',
                    background:
                      indexY == 0 || indexY == 6
                        ? 'rgb(251, 251, 250)'
                        : 'transparent'
                  }}
                  key={day}
                >
                  <div
                    className='notion-calendar-view-day'
                    style={
                      day == new Date(Date.now()).getDate() &&
                      currentYear.getMonth() ==
                        new Date(Date.now()).getMonth() &&
                      currentYear.getFullYear() ==
                        new Date(Date.now()).getFullYear()
                        ? {
                            position: 'absolute',
                            fontSize: '14px',
                            top: '4px',
                            right: '4px',
                            height: '24px',
                            width: '24px',
                            lineHeight: '24px',
                            borderRadius: '100%',
                            textAlign: 'center',
                            color: 'white',
                            background: 'rgb(235, 87, 87)'
                          }
                        : {
                            position: 'absolute',
                            fontSize: '14px',
                            top: '4px',
                            right: '10px',
                            height: '24px',
                            lineHeight: '24px',
                            textAlign: 'right',
                            transition: 'color 100ms ease-out 0s',
                            color:
                              (day == 1 && currentMonth++ == 0) ||
                              ((day <= 31 || day >= 28) && currentMonth == 1)
                                ? 'black'
                                : 'rgba(55, 53, 47, 0.5)'
                          }
                    }
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
                        style={{
                          width: 'calc(14.2857%)',
                          left: `calc(${
                            new Date(blockDate as number).getDay() == 0
                              ? 0
                              : new Date(blockDate as number).getDay() * 14.2857
                          }%)`,
                          position: 'absolute',
                          padding: '3px 6px',
                          height: `${
                            Object.keys(
                              collectionView.format?.calendar_properties
                            ).length *
                              20 +
                            30
                          }px`,
                          top: '30px'
                        }}
                        key={blockId}
                      >
                        <components.PageLink
                          href={mapPageUrl(block.id)}
                          style={{
                            display: 'block',
                            color: 'inherit',
                            textDecoration: 'none',
                            height: '100%',
                            background: 'white',
                            borderRadius: '3px',
                            boxShadow:
                              'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px'
                          }}
                        >
                          <div
                            style={{
                              userSelect: 'none',
                              transition: 'background 20ms ease-in 0s',
                              cursor: 'pointer',
                              width: '100%',
                              display: 'flex',
                              position: 'relative',
                              paddingTop: '2px',
                              paddingBottom: '2px',
                              height: '100%',
                              alignItems: 'flex-start',
                              flexDirection: 'column'
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background =
                                'rgba(55,53,47,0.08)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = '')
                            }
                          >
                            <div
                              style={{
                                paddingLeft: '6px',
                                paddingRight: '6px',
                                overflow: 'hidden',
                                width: '100%',
                                fontSize: '12px'
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  height: '20px'
                                }}
                              >
                                <div
                                  style={{
                                    userSelect: 'none',
                                    transition: 'background 20ms ease-in 0s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '12px',
                                    width: '12px',
                                    borderRadius: '0.25em',
                                    flexShrink: 0,
                                    marginRight: '4px',
                                    marginTop: '2px'
                                  }}
                                >
                                  <DefaultPageIcon
                                    style={{
                                      width: '10.8px',
                                      height: '10.8px',
                                      display: 'block',
                                      fill: 'rgba(55, 53, 47, 0.85)',
                                      flexShrink: 0,
                                      backfaceVisibility: 'hidden'
                                    }}
                                  />
                                </div>
                                <div
                                  style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    flexGrow: 1,
                                    fontSize: '12px',
                                    fontWeight: 600
                                  }}
                                >
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
                            <div
                              style={{
                                paddingLeft: '6px',
                                paddingRight: '6px',
                                overflow: 'hidden',
                                width: '100%'
                              }}
                            >
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
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '12px',
                                        height: '20px',
                                        whiteSpace: 'nowrap'
                                      }}
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