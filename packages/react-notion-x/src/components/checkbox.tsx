import React from 'react'
import { NotionComponents } from '..'

import CheckIcon from '../icons/check'

export const Checkbox: NotionComponents['checkbox'] = ({ isChecked }) => {
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
