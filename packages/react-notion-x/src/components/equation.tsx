import * as React from 'react'
import cs from 'classnames'
import dynamic from 'next/dynamic'

const DynamicTex = dynamic(() => import('@matejmazur/react-katex'))

const katexSettings = {
  throwOnError: false,
  strict: false
}

export const Equation: React.FC<{
  math: string
  block?: boolean
  children?: React.ReactNode
}> = ({ math, ...rest }) => {
  return (
    <span
      role='button'
      tabIndex={0}
      className={cs(
        'notion-equation',
        rest.block ? 'notion-equation-block' : 'notion-equation-inline'
      )}
    >
      <DynamicTex math={math} settings={katexSettings} {...rest} />
    </span>
  )
}
