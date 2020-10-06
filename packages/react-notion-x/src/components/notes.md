# Hybrid Collection Rendering Notes

- width: 100vw
- max-width: 100vw
- update padding-left and padding-right on `notion-table-view` and the header (dynamically calculated)
- update relative src and href attributes
- update footer absolute positioning via `transform`
- update cell types to be links (url, email, phone, files)

```html
<img
  src="/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fc5bf91fc-8f70-4b32-8c57-458bde39ea2c%2F00.jpg?table=block&amp;id=43fb2254-b7e3-412c-a461-566f7a83918e&amp;width=40&amp;cache=v2"
  style="max-height: 24px; margin-right: 6px;"
/>
```

```tsx
const dummyLink = ({ href, rel, target, ...rest }) => <span {...rest} />

    <NotionComponentsProvider
      components={{
        ...components,
        link: dummyLink,
        pageLink: dummyLink
      }}
    >

```

cool animation for entering viewport from dropbase.io

```css
.animate-in-begin {
  will-change: opacity, transform;
  opacity: 0.25;
  transform: translate3d(0px, 0px, 0px) scale3d(0.9, 0.9, 1) rotateX(0deg) rotateY(
      0deg
    )
    rotateZ(0deg) skew(0deg, 0deg);
  transform-style: preserve-3d;
}

.animate-in-end {
  will-change: opacity, transform;
  opacity: 1;
  transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(
      0deg
    )
    rotateZ(0deg) skew(0deg, 0deg);
  transform-style: preserve-3d;
}
```
