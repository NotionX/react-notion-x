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
        destination: '/d856b307cd704490bc923ef4255dd9f9',
        // don't set permanent to true because it will get cached by the browser
        // while developing on localhost
        permanent: false
      }
    ]
  }
})
