import * as React from 'react'

import * as types from 'notion-types'
import { Block } from 'notion-types'

import { AssetWrapper } from '../components/asset-wrapper'
import { GoogleDrive } from '../components/google-drive'

export const Drive: React.FC<{
  blockId: string
  block: Block
}> = ({ blockId, block }) => {
  const properties = block.format?.drive_properties
  if (!properties) {
    //check if this drive actually needs to be embeded ex. google sheets.
    if (block.format?.display_source) {
      return <AssetWrapper blockId={blockId} block={block} />
    }
  }

  return (
    <GoogleDrive block={block as types.GoogleDriveBlock} className={blockId} />
  )
}
