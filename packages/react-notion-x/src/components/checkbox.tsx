import * as React from 'react'

import { CheckIcon, CheckBoxIcon } from '../icons/check'
import '../styles.css'

export const Checkbox: React.FC<{
  isChecked: boolean
  blockId: string | undefined
}> = ({ isChecked }) => {
  let content = null

  if (isChecked) {
    content = (
      <div className='notion-property-checkbox notion-property-checkbox-checked'>
        <CheckIcon />
      </div>
    )
  } else {
    content = (
      <div className='notion-property-checkbox'>
        <CheckBoxIcon />
      </div>
    )
  }

  return <span className='notion-property'>{content}</span>
}
