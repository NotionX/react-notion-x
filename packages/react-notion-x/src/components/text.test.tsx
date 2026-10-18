import {
  type Block,
  type Decoration,
  type ExtendedRecordMap
} from 'notion-types'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, test } from 'vitest'

import { NotionContextProvider } from '../context'
import { Text } from './text'

test('renders custom emojis with stable native image markup', () => {
  const emojiId = 'emoji-id'
  const emojiUrl = 'https://example.com/custom-emoji.svg'
  const recordMap = {
    custom_emojis: { [emojiId]: emojiUrl }
  } as unknown as ExtendedRecordMap
  const value = [['emoji', [['ce', emojiId]]]] as unknown as Decoration[]

  const html = renderToStaticMarkup(
    <NotionContextProvider recordMap={recordMap}>
      <Text value={value} block={{ id: 'block-id' } as Block} />
    </NotionContextProvider>
  )

  expect(html).toContain(
    '<img class="notion-custom-emoji" src="https://example.com/custom-emoji.svg" alt="custom emoji"/>'
  )
})
