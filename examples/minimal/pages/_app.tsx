import React from 'react'
import Head from 'next/head'

import '../styles/globals.css'

// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'

// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'

// used for collection views (optional)
import 'rc-dropdown/assets/index.css'

// used for rendering equations (optional)
import 'katex/dist/katex.min.css'

import socialImage from '../public/social.jpg'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name='description' content='React Notion X Full Demo' />

        {socialImage ? (
          <>
            <meta name='twitter:card' content='summary_large_image' />
            <meta name='twitter:image' content={socialImage.src} />
            <meta property='og:image' content={socialImage.src} />
          </>
        ) : (
          <meta name='twitter:card' content='summary' />
        )}
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
