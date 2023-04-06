# Contributing

Suggestions and pull requests are highly encouraged. Have a look at the [open issues](https://github.com/NotionX/react-notion-x/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22+sort%3Areactions-%2B1-desc), especially [the easy ones](https://github.com/NotionX/react-notion-x/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+sort%3Areactions-%2B1-desc).

## Development

To develop the project locally, you'll need a recent version of Node.js and `pnpm` installed globally.

To get started, clone the repo and run `pnpm` from the root directory:

```bash
git clone https://github.com/NotionX/react-notion-x.git
cd react-notion-x
pnpm i
```

This will install dependencies and link all of the local packages together using [pnpm workspaces](https://pnpm.io/workspaces). This includes the example projects which point to the local version of your packages. When publishing, `"foo": "workspace:*"` will be transformed to point to the current version.

### Running development tasks
With development tasks, each package will be compiled into their respective `build` folders. Because they run `tsup --watch`, every time you make a change to one of the packages, the build will be updated automatically as long as this command is running.

We recommend running the `notion-x-example-minimal` example.

```bash
turbo dev --filter=notion-x-example-minimal...
```

Running `turbo dev` with the package name will start the example project's Next.js dev server. This project should be using your locally built version of the libraries because they have `workspace:*` on its `package.json`. The `...` at the end indicate that the `filter` should also select the package's dependencies.

You should now be able to open `http://localhost:3000` to view and debug the example project.

### Gotchas

Whenever you make a change to one of the packages that's being used by the example, the `turbo dev` command that's running the example project will re-compile that package, and the Next.js dev server should hot-reload it in the browser.

Sometimes, this process gets a little out of whack, and if you're not sure what's going on, I usually just quit one or both of the `turbo dev` commands and restart it.

If you're seeing something unexpected while debugging one of the Next.js demos, try running `turbo clean` to refresh the cache before running `turbo dev` again.
