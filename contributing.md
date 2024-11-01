# Contributing

Suggestions and pull requests are highly encouraged. Have a look at the [open issues](https://github.com/NotionX/react-notion-x/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22+sort%3Areactions-%2B1-desc), especially [the easy ones](https://github.com/NotionX/react-notion-x/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+sort%3Areactions-%2B1-desc).

## Development

To develop the project locally, you'll need a recent version of Node.js and `pnpm` installed globally.

To get started, clone the repo and run `pnpm` from the root directory:

```bash
git clone https://github.com/NotionX/react-notion-x.git
cd react-notion-x
pnpm
```

This will install dependencies and link all of the local packages together using `lerna`. This includes the example projects which will now point to the local version of your packages.

```bash
pnpm dev
```

This starts compiling the packages into their respective `build` folders

With `pnpm dev` running in one tab, we recommend opening a second tab and navigating to the `examples/minimal` directory.

```bash
cd examples/minimal
pnpm dev
```

Running `pnpm dev` from the `examples/minimal` directory will start the example project's Next.js dev server. This project ill be using your locally built version of the libraries.

You should now be able to open `http://localhost:3000` to view and debug the example project.

### Gotchas

Whenever you make a change to one of the packages, the `pnpm dev` from the project root will re-compile that package, and the `pnpm dev` from the example project's Next.js dev server should hot-reload it in the browser.

Sometimes, this process gets a little out of whack, and if you're not sure what's going on, I usually just quit one or both of the `pnpm dev` commands and restart them.

If you're seeing something unexpected while debugging one of the Next.js demos, try running `rm -rf .next` to refresh the Next.js cache before running `pnpm dev` again.
