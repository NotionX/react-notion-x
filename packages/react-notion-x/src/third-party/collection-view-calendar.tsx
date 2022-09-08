import { PageBlock } from 'notion-types'
import { getPageProperty } from 'notion-utils'
import * as React from 'react'
import { useNotionContext } from '../context'
import { CollectionViewProps } from '../types'
import { getWeeksInMonth } from '../utils'
import { CollectionGroup } from './collection-group'
import { getCollectionGroups } from './collection-utils'
import { Property } from './property'

const defaultBlockIds = []
const currentYear = new Date(Date.now())

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

  const weeksArr = getWeeksInMonth(
    currentYear.getFullYear(),
    currentYear.getMonth()
  )

  const nextMonth = () => {
    if (currentYear.getMonth() == 11) {
      currentYear.setFullYear(currentYear.getFullYear() + 1)
      currentYear.setMonth(0)
    } else currentYear.setMonth(currentYear.getMonth() + 1)
  }
  const prevMonth = () => {
    if (currentYear.getMonth() == 0) {
      currentYear.setFullYear(currentYear.getFullYear() - 1)
      currentYear.setMonth(11)
    } else currentYear.setMonth(currentYear.getMonth() - 1)
  }
  const nowMonth = () => {
    currentYear.setMonth(new Date().getMonth())
  }

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
            boxShadow: 'rgb(47, 47, 47) 0px 1px 0px'
          }}
        >
          <div
            style={{
              flexGrow: 1,
              flexBasis: '0px',
              textAlign: 'center',
              fontSize: '12px',
              height: '24px',
              color: 'rgb(55, 53, 47)'
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
              color: 'rgb(55, 53, 47)'
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
              color: 'rgb(55, 53, 47)'
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
              color: 'rgb(55, 53, 47)'
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
              color: 'rgb(55, 53, 47)'
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
              color: 'rgb(55, 53, 47)'
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
              color: 'rgb(55, 53, 47)'
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
        {[0, 1, 2, 3, 4].map((i) => (
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
            key={i}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((o) => (
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
                      o == 0 || o == 6 ? 'rgb(251, 251, 250)' : 'transparent'
                  }}
                  key={o}
                >
                  <div
                    className='notion-calendar-view-day'
                    style={
                      weeksArr[i].dates[o] == new Date(Date.now()).getDate() &&
                      currentYear.getMonth() == new Date(Date.now()).getMonth()
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
                            color: 'rgba(55, 53, 47, 0.5)'
                          }
                    }
                  >
                    {weeksArr[i].dates[o]}
                  </div>
                </div>

                {blockIds?.map((blockId) => {
                  // check riga
                  const block = recordMap.block[blockId]?.value as PageBlock
                  if (!block) return null

                  const blockDate = getPageProperty('Date', block, recordMap)
                  const titleSchema = collection.schema.title
                  const titleData = block?.properties?.title

                  if (
                    new Date(blockDate as number).getDate() ==
                      weeksArr[i].dates[o] &&
                    new Date(blockDate as number).getMonth() ==
                      currentYear.getMonth()
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
                                <Property
                                  schema={titleSchema}
                                  data={titleData}
                                  block={block}
                                  collection={collection}
                                />
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
