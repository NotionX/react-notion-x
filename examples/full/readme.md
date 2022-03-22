<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Intro

This is a more full-featured Next.js example project using `react-notion-x`, with the most important code in [`pages/[pageId].tsx`](./examples/full/pages/%5BpageId%5D.tsx) and [`components/NotionPage.tsx`](./components/NotionPage.tsx). You can view this example [live on Vercel](https://react-notion-x-demo.transitivebullsh.it).

Config can be found in [`lib/config.ts`](./lib/config.ts)

This demo adds a few nice features:

- Uses [next/image](https://nextjs.org/docs/api-reference/next/image) to serve optimal images
- Uses preview images generated using [lqip-modern](https://github.com/transitive-bullshit/lqip-modern)
- Includes larger optional components via [next/dynamic](https://nextjs.org/docs/advanced-features/dynamic-import)
  - Collection, CollectionRow
  - Code
  - Equation
  - Pdf

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Preview Images

This demo uses [next/image](https://nextjs.org/docs/api-reference/next/image) as a custom image component. It also generates preview images at page build time using [lqip-modern](https://github.com/transitive-bullshit/lqip-modern).

Note that preview image generation can be very slow, so it's recommended that you either cache the results in a key-value database or disable it by setting `previewImagesEnabled` to `false` in [`lib/config.ts`](./lib/config.ts)

Note that custom images will only be enabled if either the image has a valid preview image defined for its URL, or if you set `forceCustomImages` to `true`.

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
