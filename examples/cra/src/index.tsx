import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

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

import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
