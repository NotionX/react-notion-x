// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// used for code syntax highlighting (optional)
// import 'prismjs/themes/prism-tomorrow.css'
// used for rendering equations (optional)
// import 'katex/dist/katex.min.css'
import './index.css'

import { createRoot } from 'react-dom/client'

import App from './App'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
