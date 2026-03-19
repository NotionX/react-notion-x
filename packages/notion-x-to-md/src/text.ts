import type { Decoration, FormattedDate, RecordMap } from 'notion-types'
import { formatDate, getBlockValue, getTextContent } from 'notion-utils'

export function decorationsToMarkdown(
  decorations: Decoration[],
  recordMap: RecordMap
): string {
  return decorations
    .map((decoration) => {
      const text = decoration[0]
      const formatting = decoration[1]

      if (!formatting?.length) {
        return text
      }

      return formatting.reduce((result: string, format) => {
        const formatType = format[0]
        const formatValue = format[1]

        switch (formatType) {
          case 'b':
            return `**${result}**`

          case 'i':
            return `_${result}_`

          case 's':
            return `~~${result}~~`

          case 'c':
            return `\`${result}\``

          case 'a':
            return `[${result}](${formatValue as string})`

          case 'p': {
            const pageId = formatValue as string
            const pageBlock = getBlockValue(recordMap.block[pageId])
            const pageTitle = (pageBlock as any)?.properties?.title
              ? getTextContent((pageBlock as any).properties.title)
              : pageId
            return `[${pageTitle}](/${pageId})`
          }

          case '‣': {
            const [_, linkId] = formatValue as [string, string]
            const targetBlock = getBlockValue(recordMap.block[linkId])
            const title = (targetBlock as any)?.properties?.title
              ? getTextContent((targetBlock as any).properties.title)
              : linkId
            return `[${title}](/${linkId})`
          }

          case 'e':
            return `$${formatValue as string}$`

          case 'd': {
            const dateVal = formatValue as FormattedDate
            let dateStr = formatDate(dateVal.start_date)
            if (dateVal.end_date) {
              dateStr += ` → ${formatDate(dateVal.end_date)}`
            }
            return dateStr
          }

          case 'u': {
            const userId = formatValue as string
            const userRaw = recordMap.notion_user?.[userId]
            if (userRaw) {
              const user = getBlockValue(userRaw as any) as any
              if (user) {
                const name = [user.given_name, user.family_name]
                  .filter(Boolean)
                  .join(' ')

                return (
                  name ||
                  user.name ||
                  user.full_name ||
                  user.given_name ||
                  result
                )
              }
            }

            return result
          }

          case 'si':
            return ''

          case 'eoi': {
            const blockId = format[1]
            if (!blockId) return ''

            const eoi = getBlockValue(recordMap.block[blockId])
            if (!eoi) {
              console.log('"eoi" missing block', blockId)
              return ''
            }

            const { original_url, attributes } = eoi.format || {}
            if (!original_url || !attributes) return ''

            const title = attributes.find((attr: any) => attr.id === 'title')
              ?.values[0]
            if (!title) return ''

            return `[${title}](${original_url})`
          }

          // pass-through: color, underline, comment, link-mention
          case 'h':
          case '_':
          case 'm':
          case 'lm':
            return result

          default:
            return result
        }
      }, text)
    })
    .join('')
}
