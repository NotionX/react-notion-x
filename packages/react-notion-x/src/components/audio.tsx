import * as React from 'react'

import { AudioBlock } from 'notion-types'
import { useNotionContext } from '../context'

export const Audio: React.FC<{
  block: AudioBlock
}> = ({ block }) => {
  const { recordMap } = useNotionContext()
  const signedUrl = recordMap.signed_urls[block.id]

  return (
    <div className='notion-audio'>
      <audio controls preload='none' src={signedUrl} />
    </div>
  )
}
