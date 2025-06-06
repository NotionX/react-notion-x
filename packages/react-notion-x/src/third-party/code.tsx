// eslint-disable-next-line import/no-duplicates
import 'prismjs'
import 'prismjs/components/prism-clike.min.js'
import 'prismjs/components/prism-css-extras.min.js'
import 'prismjs/components/prism-css.min.js'
import 'prismjs/components/prism-javascript.min.js'
import 'prismjs/components/prism-js-extras.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-jsx.min.js'
import 'prismjs/components/prism-tsx.min.js'
import 'prismjs/components/prism-typescript.min.js'

import copyToClipboard from 'clipboard-copy'
import { type CodeBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
// eslint-disable-next-line import/no-duplicates, no-duplicate-imports
import prism from 'prismjs'
import React from 'react'

import { Text } from '../components/text'
import { useNotionContext } from '../context'
import CopyIcon from '../icons/copy'
import { cs } from '../utils'

export function Code({
  block,
  defaultLanguage = 'typescript',
  className
}: {
  block: CodeBlock
  defaultLanguage?: string
  className?: string
}) {
  const [isCopied, setIsCopied] = React.useState(false)
  const copyTimeout = React.useRef<number | undefined>(undefined)
  const { recordMap } = useNotionContext()
  const content = getBlockTitle(block, recordMap)
  const language = (() => {
    const languageNotion = (
      block.properties?.language?.[0]?.[0] || defaultLanguage
    ).toLowerCase()

    switch (languageNotion) {
      case 'c++':
        return 'cpp'
      case 'f#':
        return 'fsharp'
      default:
        return languageNotion
    }
  })()
  const caption = block.properties.caption

  const codeRef = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    if (codeRef.current) {
      try {
        prism.highlightElement(codeRef.current)
      } catch (err) {
        console.warn('prismjs highlight error', err)
      }
    }
  }, [codeRef])

  const onClickCopyToClipboard = React.useCallback(() => {
    void copyToClipboard(content)
    setIsCopied(true)

    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current)
      copyTimeout.current = undefined
    }

    copyTimeout.current = setTimeout(() => {
      setIsCopied(false)
    }, 1200) as unknown as number
  }, [content, copyTimeout])

  const copyButton = (
    <div className='notion-code-copy-button' onClick={onClickCopyToClipboard}>
      <CopyIcon />
    </div>
  )

  return (
    <>
      <pre
        className={cs('notion-code', `language-${language}`, className)}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
      >
        <div className='notion-code-copy'>
          {copyButton}

          {isCopied && (
            <div className='notion-code-copy-tooltip'>
              <div>{isCopied ? 'Copied' : 'Copy'}</div>
            </div>
          )}
        </div>

        <code className={`language-${language}`} ref={codeRef as any}>
          {content}
        </code>
      </pre>

      {caption && (
        <figcaption className='notion-asset-caption'>
          <Text value={caption} block={block} />
        </figcaption>
      )}
    </>
  )
}
