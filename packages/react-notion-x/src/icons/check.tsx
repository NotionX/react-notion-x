import * as React from 'react'

export function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 14 14' className='check-icon' {...props}>
      <polygon points='5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039'></polygon>
    </svg>
  )
}

export function CheckBoxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 16 16' className='check-box-suare-icon' {...props}>
      <path d='M1.5,1.5 L1.5,14.5 L14.5,14.5 L14.5,1.5 L1.5,1.5 Z M0,0 L16,0 L16,16 L0,16 L0,0 Z'></path>
    </svg>
  )
}
