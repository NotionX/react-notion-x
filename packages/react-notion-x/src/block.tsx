import * as React from 'react'

import * as types from 'notion-types'
import { uuidToId } from 'notion-utils'

import { SyncPointerBlock } from './components/sync-pointer-block'
import { useNotionContext } from './context'
import { cs } from './utils'

interface BlockProps {
  block: types.Block
  level: number

  className?: string
  bodyClassName?: string

  header?: React.ReactNode
  footer?: React.ReactNode
  pageHeader?: React.ReactNode
  pageFooter?: React.ReactNode
  pageTitle?: React.ReactNode
  pageAside?: React.ReactNode
  pageCover?: React.ReactNode

  hideBlockId?: boolean
  disableHeader?: boolean

  children?: React.ReactNode
}

export const Block: React.FC<BlockProps> = (props) => {
  const ctx = useNotionContext()

  const components = ctx.components

  const { block, children, level, hideBlockId } = props

  if (!block) {
    return null
  }

  // ugly hack to make viewing raw collection views work properly
  // e.g., 6d886ca87ab94c21a16e3b82b43a57fb
  if (level === 0 && block.type === 'collection_view') {
    ;(block as any).type = 'collection_view_page'
  }

  const blockId = hideBlockId
    ? 'notion-block'
    : `notion-block-${uuidToId(block.id)}`

  switch (block.type) {
    case 'collection_view_page':
    // fallthrough
    case 'page':
      return <components.Page blockId={blockId} {...props}></components.Page>

    case 'header':
    // fallthrough
    case 'sub_header':
    // fallthrough
    case 'sub_sub_header': {
      return (
        <components.TextHeader block={block} blockId={blockId}>
          {children}
        </components.TextHeader>
      )
    }

    case 'divider':
      return <components.Divider block={block} blockId={blockId} />

    case 'text': {
      return (
        <components.TextBlock block={block} blockId={blockId}>
          {children}
        </components.TextBlock>
      )
    }

    case 'bulleted_list':
    // fallthrough
    case 'numbered_list': {
      return (
        <components.List block={block} blockId={blockId}>
          {children}
        </components.List>
      )
    }

    case 'embed':
    // fallthrough
    case 'replit':
    // fallthrough
    case 'maps':
    // fallthrough
    case 'figma':
    // fallthrough
    case 'typeform':
    // fallthrough
    case 'codepen':
    // fallthrough
    case 'excalidraw':
    // fallthrough
    case 'gist':
      // fallthrough
      return (
        <components.AssetWrapper blockId={blockId} block={block}>
          <components.AFrame block={block} />
        </components.AssetWrapper>
      )

    case 'pdf':
      return (
        <components.AssetWrapper blockId={blockId} block={block}>
          <components.PDF block={block} />
        </components.AssetWrapper>
      )

    case 'video':
      return (
        <components.AssetWrapper blockId={blockId} block={block}>
          <components.Video block={block} />
        </components.AssetWrapper>
      )

    case 'image': // for test
      return (
        <components.AssetWrapper blockId={blockId} block={block}>
          <components.Image block={block} />
        </components.AssetWrapper>
      )

    case 'drive': {
      return <components.Drive blockId={blockId} block={block} />
    }

    case 'tweet':
      return (
        <components.AssetWrapper blockId={blockId} block={block}>
          <components.Tweet block={block} />
        </components.AssetWrapper>
      )

    case 'audio':
      return (
        <components.Audio
          block={block as types.AudioBlock}
          className={blockId}
        />
      )

    case 'file':
      return (
        <components.File block={block as types.FileBlock} className={blockId} />
      )

    case 'equation':
      return (
        <components.Equation
          block={block as types.EquationBlock}
          inline={false}
          className={blockId}
        />
      )

    case 'code':
      return <components.Code block={block as types.CodeBlock} />

    case 'column_list':
      return (
        <components.ColumnList blockId={blockId} block={block}>
          {children}
        </components.ColumnList>
      )

    case 'column':
      return (
        <components.Column blockId={blockId} block={block}>
          {children}
        </components.Column>
      )

    case 'quote': {
      return (
        <components.Quote blockId={blockId} block={block}>
          {children}
        </components.Quote>
      )
    }

    case 'collection_view':
      return (
        <components.Collection block={block} className={blockId} ctx={ctx} />
      )

    case 'callout':
      return (
        <components.Callout blockId={blockId} block={block}>
          {children}
        </components.Callout>
      )

    case 'bookmark': {
      return (
        <components.Bookmark
          blockId={blockId}
          block={block}
        ></components.Bookmark>
      )
    }

    case 'toggle':
      return (
        <components.Toggle blockId={blockId} block={block}>
          {children}
        </components.Toggle>
      )

    case 'table_of_contents':
      return <components.TableOfContents blockId={blockId} block={block} />

    case 'to_do': {
      return (
        <components.ToDo blockId={blockId} block={block}>
          {children}
        </components.ToDo>
      )
    }

    case 'transclusion_container':
      return <div className={cs('notion-sync-block', blockId)}>{children}</div>

    case 'transclusion_reference':
      return <SyncPointerBlock block={block} level={level + 1} {...props} />

    case 'alias':
      return (
        <components.Alias blockId={blockId} block={block}></components.Alias>
      )

    case 'table':
      return (
        <components.Table blockId={blockId} block={block}>
          {children}
        </components.Table>
      )

    case 'table_row':
      return (
        <components.TableRow
          blockId={blockId}
          block={block}
        ></components.TableRow>
      )

    case 'external_object_instance':
      return <components.EOI block={block} className={blockId} />

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          'Unsupported type ' + (block as any).type,
          JSON.stringify(block, null, 2)
        )
      }

      return <div />
  }

  return null
}
