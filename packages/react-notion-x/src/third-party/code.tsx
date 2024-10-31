import * as React from 'react'

import copyToClipboard from 'clipboard-copy'
import { CodeBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import { highlightElement } from 'prismjs'
import 'prismjs/components/prism-clike.min.js'
import 'prismjs/components/prism-css-extras.min.js'
import 'prismjs/components/prism-css.min.js'
import 'prismjs/components/prism-javascript.min.js'
import 'prismjs/components/prism-js-extras.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-jsx.min.js'
import 'prismjs/components/prism-tsx.min.js'
import 'prismjs/components/prism-typescript.min.js'

import { Text } from '../components/text'
import CopyIcon from '../icons/copy'
import MenuIcon from '../icons/menu'
import { cs } from '../utils'

export const Code: React.FC<{
  block: CodeBlock
  defaultLanguage?: string
  className?: string
  ctx: any
}> = ({ block, defaultLanguage = 'typescript', className, ctx }) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const copyTimeout = React.useRef<number>()
  const { recordMap, customFunctions } = ctx
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
  const codeRef = React.useRef()
  React.useEffect(() => {
    if (codeRef.current) {
      try {
        highlightElement(codeRef.current)
      } catch (err) {
        console.warn('prismjs highlight error', err)
      }
    }
  }, [codeRef])

  const onClickCopyToClipboard = React.useCallback(() => {
    copyToClipboard(content)
    setIsCopied(true)

    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current)
      copyTimeout.current = null
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

  const handleCodeMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    if (customFunctions.codeMenuActions) {
      customFunctions.codeMenuActions(content, language, block)
    }
    setIsMenuOpen(false)
  }

  const MenuButton = (
    <div className='notion-code-menu-button' onClick={handleCodeMenu}>
      <MenuIcon />
    </div>
  )
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <>
      <pre className={cs('notion-code', className)}>
        <div className='notion-code-copy'>
          {copyButton}
          {isCopied && (
            <div className='notion-code-copy-tooltip'>
              <div>{isCopied ? 'Copied' : 'Copy'}</div>
            </div>
          )}
        </div>

        <div className='notion-code-menu'>
          {MenuButton}
          <div className='notion-code-menu-tooltip'>
            <div>{isMenuOpen ? 'Menu Open' : 'Menu'}</div>
          </div>
        </div>

        <code className={`language-${language}`} ref={codeRef}>
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
