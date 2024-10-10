import * as React from 'react'

function SvgLeftChevron(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 30 30' {...props}>
      <polygon points='12.6 15 23 25.2 20.2 28 7 15 20.2 2 23 4.8'></polygon>
    </svg>
  )
}

export default SvgLeftChevron
