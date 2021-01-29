import React from 'react'
import { cs } from '../utils'
import { useNotionContext } from '../context'

const katexSettings = {
  throwOnError: false,
  strict: false
}

export const Equation: React.FC<{
  math: string
  block?: boolean
  children?: React.ReactNode
  className?: string
}> = ({ math, className, ...rest }) => {
  const { components } = useNotionContext()

  return (
    <span
      role='button'
      tabIndex={0}
      className={cs(
        'notion-equation',
        rest.block ? 'notion-equation-block' : 'notion-equation-inline',
        className
      )}
    >
      <components.equation math={math} settings={katexSettings} {...rest} />
    </span>
  )
}
