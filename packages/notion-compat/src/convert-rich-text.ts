import * as notion from 'notion-types'
import * as types from './types'

import { convertColor } from './convert-color'

export function convertRichText(richText: types.RichText): notion.Decoration[] {
  return richText.map(convertRichTextItem).filter(Boolean)
}

export function convertRichTextItem(
  richTextItem: types.RichTextItem
): notion.Decoration | null {
  switch (richTextItem.type) {
    case 'text': {
      const subdecorations: notion.SubDecoration[] = []

      if (richTextItem.annotations.bold) {
        subdecorations.push(['b'])
      }

      if (richTextItem.annotations.italic) {
        subdecorations.push(['i'])
      }

      if (richTextItem.annotations.strikethrough) {
        subdecorations.push(['s'])
      }

      if (richTextItem.annotations.underline) {
        subdecorations.push(['_'])
      }

      if (richTextItem.annotations.code) {
        subdecorations.push(['c'])
      }

      if (richTextItem.annotations.color !== 'default') {
        subdecorations.push(['h', convertColor(richTextItem.annotations.color)])
      }

      if (richTextItem.text.link) {
        subdecorations.push(['a', richTextItem.text.link.url])
      }

      return [richTextItem.text.content, subdecorations]
    }

    case 'equation':
      // TODO
      break

    case 'mention':
      // TODO
      break
  }

  return null
}
