<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# React Notion X

> Fast and accurate React renderer for Notion.

[![NPM](https://img.shields.io/npm/v/react-notion-x.svg)](https://www.npmjs.com/package/react-notion-x) [![Build Status](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml/badge.svg)](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Docs

One of the most frequently export from React Notion X is `NotionRenderer`, a component that streamlines the rendering Notion content into HTML.

It requires the mandatory prop `recordMap`, which is the result of querying a Notion page by calling `getPage` method from `notion-client`.

In addition, it accepts the following optional props:

- `mapPageUrl`: Function for rewriting path to another Notion page if it is linked to in the given page's content.
- `header` and `footer`: Set the components to be used for rendering `<header>` and `<footer>` element.
- `defaultPageIcon`, `defaultPageCover`, `defaultPageCoverPosition`: Default icon, image cover and image cover position. If they are defined, they will be rendered inside the `<main>` element.
- `fullPage`: Render page content only and disregards any header, cover image, and footer
- `rootDomain`: If defined, when Notion content contains link to another Notion page, NotionRenderer will include the root domain in rewriting `href`.
- `rootPageId`: If defined, it is useful in the following two cases:
  - When `header` prop is given, which contains a search bar component, which in turns needs to know the root page id to return children pages within the root page that matches a search query.
  - When `mapPageUrl` prop is given a function for mapping Notion page urls, it needs to know the root page id. If a given page ID is equal to this root page id, it returns url as `/`, or `/${pageId}` otherwise.


See the [full docs](https://github.com/NotionX/react-notion-x).

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
