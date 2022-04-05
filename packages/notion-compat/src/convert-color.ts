import * as notion from 'notion-types'

export function convertColor(color: string): notion.Color {
  switch (color) {
    case 'green':
      return 'teal'

    case 'green_background':
      return 'teal_background'

    default:
      return color as notion.Color
  }
}
