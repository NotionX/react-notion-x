import type * as React from 'react'
import { type AudioBlock } from 'notion-types'

import { useNotionContext } from '../context'
import { cs } from '../utils'

export function Audio({
  block,
  className
}: {
  block: AudioBlock
  className?: string
}) {
  const { recordMap } = useNotionContext()

  let source =
    recordMap.signed_urls[block.id] || block.properties?.source?.[0]?.[0]

  if (block.space_id) {
    source = source.concat('&spaceId=', block.space_id)
  }
  return (
    <div className={cs('notion-audio', className)}>
      <audio controls preload='none' src={source} />
    </div>
  )
}
