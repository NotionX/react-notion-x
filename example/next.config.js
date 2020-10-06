module.exports = {
  async redirects() {
    return [
      // redirect the index page to our notion test suite
      {
        source: '/',
        destination: '/067dd719a912471ea9a3ac10710e7fdf',
        permanent: true
      }
    ]
  }
}
