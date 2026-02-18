import type * as types from 'notion-types'
import React from 'react'

import { useNotionContext } from '../context'
import { cs } from '../utils'
import { Text } from './text'

interface AutomationValue {
  id: string
  action_ids: string[]
  properties?: {
    name?: string
    icon?: string
  }
  trigger?: {
    type: string
  }
}

interface AutomationActionValue {
  id: string
  type: 'open_page' | 'send_webhook' | 'http_request' | string
  config?: {
    target?: {
      type?: 'url' | 'page'
      url?: string
      pageId?: string
    }
    url?: string
    method?: string
    headers?: Record<string, string>
    body?: string
    apiVersion?: string
    customHeaders?: Array<{
      id: string
      key: string
      value: string
    }>
  }
}

export function Button({
  block,
  blockId,
  className
}: {
  blockId: string
  block: types.ButtonBlock
  className?: string
}) {
  const { recordMap, mapPageUrl } = useNotionContext()
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  if (!block || block.type !== 'button') {
    console.warn('Invalid button block:', { block })
    return null
  }

  // Get automation ID from block format
  const automationId = block.format?.automation_id

  // Get button text and color
  const blockColor = block.format?.block_color || 'default'
  const title = block.properties?.title

  // If no automation, render a simple static button
  if (!automationId) {
    return (
      <div className={cs('notion-button-block', blockId)}>
        <button
          type='button'
          className={cs('notion-button', `notion-${blockColor}`, className)}
        >
          {title ? <Text value={title} block={block} /> : 'Button'}
        </button>
      </div>
    )
  }

  // Get automation data
  const automation = (recordMap as any).automation?.[automationId]?.value as
    | AutomationValue
    | undefined

  if (!automation) {
    // Fallback to title if no automation found
    const buttonText = title ? getTextContent(title) : 'Button'
    return (
      <div className={cs('notion-button-block', blockId)}>
        <button
          type='button'
          className={cs('notion-button', `notion-${blockColor}`, className)}
        >
          {buttonText}
        </button>
      </div>
    )
  }

  // Get button text from automation properties or fall back to title
  const buttonText =
    automation.properties?.name || (title ? getTextContent(title) : 'Button')

  // Handle button click - execute the first action
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (isLoading) return

    setIsSuccess(false)
    setIsLoading(true)

    try {
      await executeAction()
    } finally {
      setIsLoading(false)
    }
  }

  const executeAction = async () => {
    // Get the first action
    const firstActionId = automation.action_ids?.[0]
    if (!firstActionId) {
      console.warn('No actions defined for automation:', automationId)
      return
    }

    const actionData = (recordMap as any).automation_action?.[firstActionId]
      ?.value as AutomationActionValue | undefined
    if (!actionData) {
      console.warn('No action data found for ID:', firstActionId)
      return
    }

    // Execute action based on type
    switch (actionData.type) {
      case 'open_page': {
        // Handle open_page action
        const target = actionData.config?.target
        if (target?.type === 'url' && target.url) {
          // Open URL in new tab
          window.open(target.url, '_blank', 'noopener,noreferrer')
        } else if (target?.type === 'page' && target.pageId) {
          // Navigate to Notion page using mapPageUrl
          const pageUrl = mapPageUrl(target.pageId)
          if (pageUrl) {
            window.location.href = pageUrl
          }
        }
        break
      }

      case 'send_webhook':
      case 'http_request': {
        // Handle webhook action - requires custom webhook proxy
        const webhookUrl = actionData.config?.url?.trim()
        if (webhookUrl) {
          try {
            // Try to use webhook proxy if available
            if (typeof window !== 'undefined' && '/api/webhook-proxy') {
              const pageBlockId = Object.keys(recordMap.block || {}).find(
                (id) => {
                  const b = recordMap.block[id]?.value
                  return b && 'type' in b && b.type === 'page'
                }
              )
              const pageBlock = pageBlockId
                ? (recordMap.block[pageBlockId]?.value as any)
                : null

              if (!pageBlock) {
                console.warn('No page block found for webhook payload')
                return
              }

              // Build Notion-style webhook payload
              const payload = {
                source: {
                  type: 'automation',
                  automation_id: automationId,
                  action_id: actionData.id,
                  event_id: crypto.randomUUID(),
                  user_id: pageBlock.created_by_id || 'unknown',
                  attempt: 1
                },
                data: {
                  object: 'page',
                  id: pageBlock.id,
                  created_time: new Date(pageBlock.created_time).toISOString(),
                  last_edited_time: new Date(
                    pageBlock.last_edited_time
                  ).toISOString(),
                  created_by: {
                    object: 'user',
                    id: pageBlock.created_by_id || 'unknown'
                  },
                  last_edited_by: {
                    object: 'user',
                    id: pageBlock.last_edited_by_id || 'unknown'
                  },
                  cover: pageBlock.format?.page_cover
                    ? {
                        type: 'external',
                        external: {
                          url: pageBlock.format.page_cover.startsWith('/')
                            ? `https://www.notion.so${pageBlock.format.page_cover}`
                            : pageBlock.format.page_cover
                        }
                      }
                    : null,
                  icon: pageBlock.format?.page_icon
                    ? {
                        type: 'external',
                        external: { url: pageBlock.format.page_icon }
                      }
                    : null,
                  parent: {
                    type: 'workspace',
                    workspace: true
                  },
                  archived: !pageBlock.alive,
                  in_trash: false,
                  is_locked: false,
                  properties: {
                    title: {
                      id: 'title',
                      type: 'title',
                      title: pageBlock.properties?.title
                        ? pageBlock.properties.title.map((t: any) => {
                            const text = typeof t === 'string' ? t : t[0] || ''
                            return {
                              type: 'text',
                              text: { content: text, link: null },
                              annotations: {
                                bold: false,
                                italic: false,
                                strikethrough: false,
                                underline: false,
                                code: false,
                                color: 'default'
                              },
                              plain_text: text,
                              href: null
                            }
                          })
                        : []
                    }
                  },
                  url: `https://www.notion.so/${pageBlock.id}`,
                  public_url: window.location.href,
                  request_id: crypto.randomUUID()
                }
              }

              // Build headers from customHeaders array
              const headers: Record<string, string> = {
                'Content-Type': 'application/json'
              }
              if (actionData.config?.customHeaders) {
                for (const header of actionData.config.customHeaders) {
                  headers[header.key] = header.value
                }
              }

              console.log('Sending webhook:', {
                url: webhookUrl,
                payload,
                headers
              })

              // Send through proxy API to avoid CORS issues
              const response = await fetch('/api/webhook-proxy', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: webhookUrl, payload, headers })
              })

              const result = await response.json()

              if (!response.ok || !result.success) {
                console.error('Webhook request failed:', result)
              } else {
                console.log('Webhook sent successfully:', result)
                setIsSuccess(true)
                setTimeout(() => setIsSuccess(false), 2000)
              }
            } else {
              console.warn(
                'Webhook functionality requires /api/webhook-proxy endpoint'
              )
            }
          } catch (err) {
            console.error('Error sending webhook:', err)
          }
        }
        break
      }

      default:
        console.warn('Unsupported action type:', actionData.type)
    }
  }

  return (
    <div className={cs('notion-button-block', blockId)}>
      <button
        type='button'
        className={cs(
          'notion-button',
          `notion-${blockColor}`,
          isSuccess ? 'notion-success' : '',
          className
        )}
        onClick={handleClick}
        title={buttonText}
        disabled={isLoading}
      >
        {buttonText}
      </button>
    </div>
  )
}

function getTextContent(text: types.Decoration[]): string {
  return text.map((t) => (typeof t === 'string' ? t : t[0] || '')).join('')
}
