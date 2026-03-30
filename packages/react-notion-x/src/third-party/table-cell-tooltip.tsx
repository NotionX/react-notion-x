import React from 'react'
import { createPortal } from 'react-dom'

/**
 * A lightweight tooltip that appears when hovering over truncated
 * (nowrap) table cells. Uses a single portal element for all cells,
 * positioned dynamically based on the hovered cell's bounding rect.
 *
 * Uses delegated event handling on the table body to avoid per-cell
 * listeners.
 */
export function TableCellTooltip({
    tableRef
}: {
    tableRef: React.RefObject<HTMLDivElement | null>
}) {
    const [tooltip, setTooltip] = React.useState<{
        html: string
        rect: DOMRect
    } | null>(null)

    const hideTimeout = React.useRef<number | undefined>(undefined)

    React.useEffect(() => {
        const tableEl = tableRef.current
        if (!tableEl) return

        function handleMouseEnter(e: MouseEvent) {
            const cell = (e.target as HTMLElement).closest?.(
                '.notion-table-cell-nowrap'
            ) as HTMLElement | null
            if (!cell) return

            // Don't show tooltip for URL cells — they have their own abbreviated display
            if (cell.classList.contains('notion-table-cell-url')) return

            // Check for truncation — either on the cell itself or on inner select/multi-select items
            let isTruncated = cell.scrollWidth > cell.clientWidth
            let tooltipEl: HTMLElement = cell

            if (!isTruncated) {
                // Check if any select/multi-select badge is truncated
                const selectItem = cell.querySelector(
                    '.notion-property-select-item, .notion-property-multi_select-item'
                ) as HTMLElement | null
                if (selectItem && selectItem.scrollWidth > selectItem.clientWidth) {
                    isTruncated = true
                    tooltipEl = selectItem
                }
            }

            if (!isTruncated) return

            if (hideTimeout.current) {
                clearTimeout(hideTimeout.current)
                hideTimeout.current = undefined
            }

            const rect = cell.getBoundingClientRect()
            setTooltip({ html: tooltipEl.innerHTML, rect })
        }

        function handleMouseLeave(e: MouseEvent) {
            const cell = (e.target as HTMLElement).closest?.(
                '.notion-table-cell-nowrap'
            )
            if (!cell) return

            // Small delay to prevent flicker when moving between cells
            hideTimeout.current = window.setTimeout(() => {
                setTooltip(null)
            }, 50)
        }

        tableEl.addEventListener('mouseenter', handleMouseEnter, true)
        tableEl.addEventListener('mouseleave', handleMouseLeave, true)

        return () => {
            tableEl.removeEventListener('mouseenter', handleMouseEnter, true)
            tableEl.removeEventListener('mouseleave', handleMouseLeave, true)
            if (hideTimeout.current) {
                clearTimeout(hideTimeout.current)
            }
        }
    }, [tableRef])

    if (!tooltip || typeof document === 'undefined') return null

    const style: React.CSSProperties = {
        position: 'fixed',
        left: tooltip.rect.left,
        top: tooltip.rect.top - 6,
        transform: 'translateY(-100%)',
        minWidth: tooltip.rect.width,
        maxWidth: 'calc(100vw - 24px)',
        zIndex: 100,
        background: 'rgb(44, 44, 43)',
        color: 'rgb(240, 239, 237)',
        borderRadius: 6,
        padding: '5px 8px',
        fontSize: 12,
        lineHeight: 1.4,
        whiteSpace: 'normal',
        wordBreak: 'break-word',
        boxShadow:
            'rgba(0,0,0,0.08) 0 4px 12px -2px, rgba(255,255,255,0.05) 0 0 0 1px inset',
        pointerEvents: 'none',
        opacity: 1,
        transition: 'opacity 50ms ease-out'
    }

    return createPortal(
        <div
            className='notion-table-cell-tooltip'
            style={style}
            dangerouslySetInnerHTML={{ __html: tooltip.html }}
        />,
        document.body
    )
}
