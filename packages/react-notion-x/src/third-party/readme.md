# react-notion-x third-party modules

All of the modules in this folder contain large, optional, third-party dependencies.

To guarantee minimal bundle size, they must be imported separately from the rest of `react-notion-x`.

## Components

Here's an example of how you can import each of the third-party components.

```tsx
import { Code } from 'react-notion-x/third-party/code'
import { Collection } from 'react-notion-x/third-party/collection'
import { Equation } from 'react-notion-x/third-party/equation'
import { Modal } from 'react-notion-x/third-party/modal'
import { Pdf } from 'react-notion-x/third-party/pdf'
```

NOTE: we strongly recommend that you consider lazy-loading these components unless your use case depends heavily on them.

## Next.js dynamic loading example

If you're using Next.js, you can use [next/dynamic](https://nextjs.org/docs/advanced-features/dynamic-import) to lazy load these components.

```tsx
import dynamic from 'next/dynamic'

const Collection = dynamic(() =>
  import('react-notion-x/third-party/collection').then((m) => m.Collection)
)
const Code = dynamic(() =>
  import('react-notion-x/third-party/code').then((m) => m.Code)
)
const Equation = dynamic(() =>
  import('react-notion-x/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)
const Modal = dynamic(
  () => import('react-notion-x/third-party/modal').then((m) => m.Modal),
  {
    ssr: false
  }
)

// ...

function MyComponent() {
  return (
    <NotionRenderer
      components={{
        Code,
        Collection,
        Equation,
        Modal,
        Pdf
      }}
    />
  )
}
```

## License

MIT © [Travis Fischer](https://transitivebullsh.it)

Support my OSS work by <a href="https://twitter.com/transitive_bs">following me on twitter <img src="https://storage.googleapis.com/saasify-assets/twitter-logo.svg" alt="twitter" height="24px" align="center"></a>
