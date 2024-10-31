import * as React from 'react'

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill='currentColor'
      viewBox='0 0 24 24'
      width='1em'
      {...props} // Spread the props onto the SVG element
    >
      <path
        fillRule='evenodd'
        d='M12 4a1 1 0 100 2 1 1 0 000-2zm3 1a3 3 0 11-6 0 3 3 0 016 0zm-3 6a1 1 0 100 2 1 1 0 000-2zm3 1a3 3 0 11-6 0 3 3 0 016 0zm-4 7a1 1 0 112 0 1 1 0 01-2 0zm1 3a3 3 0 100-6 3 3 0 000 6z'
        clipRule='evenodd'
      ></path>
    </svg>
  )
}

export default MenuIcon
