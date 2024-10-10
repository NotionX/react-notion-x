import * as React from 'react'

import { Block } from 'notion-types'

import { PageTitle } from '../components/page-title'
import { useNotionContext } from '../context'
import { cs } from '../utils'

export const Alias: React.FC<{
  blockId: string
  block: Block
}> = ({ block }) => {
  const ctx = useNotionContext()
  const { recordMap, components, mapPageUrl } = ctx

  const blockPointerId = block?.format?.alias_pointer?.id
  const linkedBlock = recordMap.block[blockPointerId]?.value
  if (!linkedBlock) {
    console.log('"alias" missing block', blockPointerId)
    return null
  }

  return (
    <components.PageLink
      className={cs('notion-page-link', blockPointerId)}
      href={mapPageUrl(blockPointerId)}
    >
      <PageTitle block={linkedBlock} />
    </components.PageLink>
  )
}
