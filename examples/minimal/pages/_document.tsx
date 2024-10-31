import Document, { Head, Html, Main, NextScript } from 'next/document'
import * as React from 'react'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head />

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
