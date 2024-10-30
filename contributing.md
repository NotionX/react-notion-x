# Contributing

Suggestions and pull requests are highly encouraged. Have a look at the [open issues](https://github.com/NotionX/react-notion-x/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22+sort%3Areactions-%2B1-desc), especially [the easy ones](https://github.com/NotionX/react-notion-x/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22+sort%3Areactions-%2B1-desc).

## Development
### Installing and using mise
This project has a few aging dependencies like `node-gyp` and `lerna`.

Getting the project up and running was a bit hard so we defined the environment using [mise](https://github.com/jdx/mise). Mise is a tool like `nvm` or `asdf` and allows locking up both `python` and `nodejs` versions and ensures you have `yarn` installed as well.

We would love to see contributions which would help updating the aging dependencies ❤️.

If you are using MacOS you can install mise with `homebrew`:
```sh
brew install mise
```
Otherwise please check [mise installation docs](https://mise.jdx.dev/getting-started.html).

Then activate mise. This depends on your shell. You can either run one of the following or copy them to your shell configs:
```sh
# Bash
eval "$(mise activate bash)"
# ZSH
eval "$(mise activate zsh)"
# Fish
mise activate fish | source
```

### Cloning the repo and installing packages
After installing `mise` you can proceed to clone the repo and run `yarn` from the root directory:

```bash
git clone https://github.com/NotionX/react-notion-x.git
cd react-notion-x
yarn
```

This will install dependencies and link all of the local packages together using `lerna`. This includes the example projects which will now point to the local version of your packages.

```bash
yarn dev
```

This starts compiling the packages into their respective `build` folders. Under the hood, it is running `tsc --watch` and `tsup --watch`, so every time you make a change to one of the packages, the build will be updated automatically as long as this command is running.

With `yarn dev` running in one tab, we recommend opening a second tab and navigating to the `examples/minimal` directory.

```bash
cd examples/minimal
yarn dev
```

Running `yarn dev` from the `examples/minimal` directory will start the example project's Next.js dev server. This project should be using your locally built version of the libraries because they have been linked using `lerna`.

You should now be able to open `http://localhost:3000` to view and debug the example project.

### Gotchas

Whenever you make a change to one of the packages, the `yarn dev` from the project root will re-compile that package, and the `yarn dev` from the example project's Next.js dev server should hot-reload it in the browser.

Sometimes, this process gets a little out of whack, and if you're not sure what's going on, I usually just quit one or both of the `yarn dev` commands and restart them.

If you're seeing something unexpected while debugging one of the Next.js demos, try running `rm -rf .next` to refresh the Next.js cache before running `yarn dev` again.
