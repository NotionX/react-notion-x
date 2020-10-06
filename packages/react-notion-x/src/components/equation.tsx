import * as React from 'react'
import dynamic from 'next/dynamic'
import { cs } from '../utils'

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
