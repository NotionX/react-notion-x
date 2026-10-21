import type { ExtendedRecordMap } from 'notion-types'
import { getBlockValue } from 'notion-utils'
import { expect, test } from 'vitest'

import { decodeEquation } from './equation'
import { notionPageToMarkdown } from './notion-page-to-markdown'

function fixture() {
  return {
    block: {
      page: {
        value: {
          id: 'page',
          type: 'page',
          content: ['text', 'equation', 'code']
        }
      },
      text: {
        value: {
          id: 'text',
          type: 'text',
          properties: {
            title: [
              ['Score '],
              ['⁍', [['e', String.raw`s_i \\rightarrow a_i`]]],
              [' now']
            ]
          }
        }
      },
      equation: {
        value: {
          id: 'equation',
          type: 'equation',
          properties: {
            title: [[String.raw`\\mathcal{L}\n=\\frac{a}{b}`]]
          }
        }
      },
      code: {
        value: {
          id: 'code',
          type: 'code',
          properties: {
            title: [[String.raw`\\frac{a}{b}`]]
          }
        }
      }
    }
  } as unknown as ExtendedRecordMap
}

test('opt-in decodes inline and display math, leaving code and input unchanged', async () => {
  const records = fixture()
  const original = structuredClone(records)
  const md = await notionPageToMarkdown(records, { decodeEscapedMath: true })
  expect(md).toContain(String.raw`Score $s_i \rightarrow a_i$ now`)
  expect(md).toContain('$$\n\\mathcal{L}\n=\\frac{a}{b}\n$$')
  expect(md).toContain('```\n' + String.raw`\\frac{a}{b}` + '\n```')
  expect(records).toEqual(original)
})

test('default preserves existing escaped content', async () => {
  const md = await notionPageToMarkdown(fixture())
  expect(md).toContain(String.raw`$s_i \\rightarrow a_i$`)
  expect(md).toContain(String.raw`\\mathcal{L}\n=\\frac{a}{b}`)
})

test('decodes exactly one layer of encoded matrix row breaks', () => {
  expect(
    decodeEquation(String.raw`\\begin{matrix}a & b \\\\ c & d\\end{matrix}`)
  ).toBe(String.raw`\begin{matrix}a & b \\ c & d\end{matrix}`)
})

test.each([String.raw`\nu + \nabla f`, 'x + y', 'x\n+ y'])(
  'keeps single-escaped commands and plain text: %s',
  (formula) => {
    expect(decodeEquation(formula)).toBe(formula)
  }
)

test('default does not guess that an ordinary TeX row break is encoded', async () => {
  const records = fixture()
  getBlockValue(records.block.equation!)!.properties!.title = [
    [String.raw`\begin{matrix}a\\b\end{matrix}`]
  ]
  expect(await notionPageToMarkdown(records)).toContain(
    String.raw`\begin{matrix}a\\b\end{matrix}`
  )
})
