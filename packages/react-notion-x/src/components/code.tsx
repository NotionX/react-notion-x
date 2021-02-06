import React from 'react'
import { highlight, languages } from 'prismjs'

import 'prismjs/components/prism-jsx'

export const Code: React.FC<{ code: string; language: string }> = ({
  code,
  language = 'javascript'
}) => {
  const languageL = language.toLowerCase()
  const prismLanguage = languages[languageL] || languages.javascript

  return (
    <pre className='notion-code'>
      <code
        className={`language-${languageL}`}
        dangerouslySetInnerHTML={{
          __html: highlight(code, prismLanguage, language)
        }}
      />
    </pre>
  )
}
