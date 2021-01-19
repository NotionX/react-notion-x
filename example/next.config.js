'use strict'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  async redirects() {
    return [
      // redirect the index page to our notion test suite
      {
        source: '/',
        destination: '/067dd719a912471ea9a3ac10710e7fdf',
        // don't set permanent to true because it will get cached by browser
        // while developing on localhost
        permanent: false
      }
    ]
  }
})
