<p align="center">
  <img alt="React Notion X" src="https://raw.githubusercontent.com/NotionX/react-notion-x/master/media/notion-ts.png" width="689">
</p>

# React Notion X

> Fast and accurate React renderer for Notion.

[![NPM](https://img.shields.io/npm/v/react-notion-x.svg)](https://www.npmjs.com/package/react-notion-x) [![Build Status](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml/badge.svg)](https://github.com/NotionX/react-notion-x/actions/workflows/test.yml) [![Prettier Code Formatting](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)

## Docs

One of the most frequently export from React Notion X is `NotionRenderer`, a component that streamlines the rendering Notion content into HTML.

It requires the mandatory prop `recordMap`, which is the result of querying a Notion page by calling `getPage` method from `notion-client`.

Bare minimum markup for a Notion page with id `1234` which contains two block ids 1 and 2:

```
<main class="notion notion-app notion-block-1234">
  <div class="notion-viewport"></div>
  <div class="notion-text notion-block-1"></div>
  <div class="notion-text notion-block-2"></div>
</main>
```

`<NotionRender>` accepts many optional props to suit a variety of page building scenarios:

### `fullPage`

This prop determines how the rendered page will look. If set to `true`, the page will include the extra elements:
- header (provided by `NotionRenderer` by default)
- page title (inferred from the Title property of the page)
- aside and footer (only if the `aside` and `footer` props are given values)

### `header`

`NotionRender` already renders a `<header>` element by default that includes breadcrumbs for the current page. If `header` prop is defined, this element will be added right after the default `<header>` element.

Example markup when `fullPage` is set to `true` and `header` is defined:

```
const header = <div className="header"></div>

return (
  <NotionRender
    fullPage={true}
    header={header}
  />
)
```

Equivalent markup:

```
<div class="notion notion-app notion-block-1234">
  <div class="notion-viewport"></div>
  <div class="notion-frame">
    <header class="notion-header"></header>
    <div class="notion-page-scroller">
      <main>
        <h1 class="notion-title"></h1>
        <div notion-page-content>
          <article class="notion-page-content-inner">
            <div class="notion-text notion-block-1"></div>
            <div class="notion-text notion-block-2"></div>
          </article>
        </div>
      </main>
    </div>
  </div>
</div>

```

### `footer`

This only takes effect when `fullPage` is set to `true` and will add an extra element after the `<main>` element.

### `pageHeader`

This adds an extra element before `<h1>` and this element will become the first child of `<main>`.

### `pageFooter`

This adds an extra element as the last child of `<main>`.

### `mapPageUrl`

Function for rewriting path to another Notion page if it is linked to in the given page's content.

### `defaultPageIcon`, `defaultPageCover`, `defaultPageCoverPosition`

Default icon, image cover and image cover position. If they are defined, they will be rendered inside the `<main>` element.
- `rootDomain`: If defined, when Notion content contains link to another Notion page, NotionRenderer will include the root domain in rewriting `href`.
- `rootPageId`: If defined, it is useful in the following two cases:
  - When `header` prop is given, which contains a search bar component, which in turns needs to know the root page id to return children pages within the root page that matches a search query.
  - When `mapPageUrl` prop is given a function for mapping Notion page urls, it needs to know the root page id. If a given page ID is equal to this root page id, it returns url as `/`, or `/${pageId}` otherwise.


See the [full docs](https://github.com/NotionX/react-notion-x).

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
