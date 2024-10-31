import * as React from 'react'

function SvgRightChevron(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 30 30' {...props}>
      <polygon points='17.4,15 7,25.2 9.8,28 23,15 9.8,2 7,4.8'></polygon>
    </svg>
  )
}

export default SvgRightChevron
