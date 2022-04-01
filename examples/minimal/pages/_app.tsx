import React from 'react'

import '../styles/globals.css'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/build/styles.css'

// used for code syntax highlighting (optional)
// import 'prismjs/themes/prism-tomorrow.css'

// used for collection views (optional)
// import 'react-notion-x/build/third-party/collection.css'

// used for rendering equations (optional)
// import 'react-notion-x/build/third-party/equation.css'

// used for tweet embeds (optional)
// import 'react-static-tweets/styles.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
