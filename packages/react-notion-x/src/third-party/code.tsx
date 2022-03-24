import React from 'react'
import { highlightElement } from 'prismjs'
import { CodeBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'

import { Text } from '../components/text'
import { useNotionContext } from '../context'
import { cs } from '../utils'

import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-css-extras'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-js-extras'
import 'prismjs/components/prism-js-templates'
import 'prismjs/components/prism-coffeescript'
import 'prismjs/components/prism-diff'
import 'prismjs/components/prism-git'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-handlebars'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-less'
import 'prismjs/components/prism-makefile'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-objectivec'
import 'prismjs/components/prism-ocaml'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-reason'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sass'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-solidity'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-stylus'
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-wasm'
import 'prismjs/components/prism-yaml'

export const Code: React.FC<{
  block: CodeBlock
  defaultLanguage?: string
  className?: string
}> = ({ block, defaultLanguage = 'typescript', className }) => {
  const { recordMap } = useNotionContext()
  const content = getBlockTitle(block, recordMap)
  const language = (
    block.properties?.language?.[0]?.[0] || defaultLanguage
  ).toLowerCase()
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

  return (
    <>
      <pre className={cs('notion-code', className)}>
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
