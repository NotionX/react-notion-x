export default {
  staticPageGenerationTimeout: 300,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'file.notion.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' }
    ],
    formats: ['image/avif', 'image/webp']
  }
}
