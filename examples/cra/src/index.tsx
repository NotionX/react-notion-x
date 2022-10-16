import * as React from 'react'

import * as ReactDOM from 'react-dom'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'

import App from './App'
// used for code syntax highlighting (optional)
// import 'prismjs/themes/prism-tomorrow.css'
// used for rendering equations (optional)
// import 'katex/dist/katex.min.css'
import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
