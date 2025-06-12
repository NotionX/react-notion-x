import type React from 'react'

import CheckIcon from '../icons/check'

export function Checkbox({
  isChecked
}: {
  isChecked: boolean
  blockId?: string
}) {
  let content = null

  if (isChecked) {
    content = (
      <div className='notion-property-checkbox-checked'>
        <CheckIcon />
      </div>
    )
  } else {
    content = <div className='notion-property-checkbox-unchecked' />
  }

  return (
    <span className='notion-property notion-property-checkbox'>{content}</span>
  )
}
