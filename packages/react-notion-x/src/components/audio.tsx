import React from 'react'

import { AudioBlock } from 'notion-types'
import { useNotionContext } from '../context'
import { cs } from '../utils'

export const Audio: React.VFC<{
  block: AudioBlock
  className?: string
}> = ({ block, className }) => {
  const { recordMap } = useNotionContext()
  const signedUrl = recordMap.signed_urls[block.id]

  return (
    <div className={cs('notion-audio', className)}>
      <audio controls preload='none' src={signedUrl} />
    </div>
  )
}
