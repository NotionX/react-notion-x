import { type AudioBlock } from 'notion-types'
import { getSignedFileUrl } from 'notion-utils'

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

  const source = getSignedFileUrl(
    block.properties?.source?.[0]?.[0],
    block,
    recordMap.signed_urls
  )

  if (!source) {
    return null
  }

  return (
    <div className={cs('notion-audio', className)}>
      <audio controls preload='none' src={source} />
    </div>
  )
}
