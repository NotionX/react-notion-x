# Governance

`react-notion-x` and its packages are maintained by [Travis Fischer](https://github.com/transitive-bullshit), who created the project and has the final say on its direction.

## Decisions

- Bugs and feature requests are tracked in [GitHub issues](https://github.com/NotionX/react-notion-x/issues), and all changes land via pull requests.
- Anyone can open a pull request. The maintainer reviews and merges pull requests.
- Larger changes, like new packages, breaking API changes or dropping support for a runtime, should be discussed in an issue first.
- When there's no clear consensus, the maintainer makes the call.

## Releases

- All packages in this monorepo share one version number and follow [semver](https://semver.org).
- The maintainer cuts releases with `pnpm release`, which bumps versions, tags `vX.Y.Z` and publishes every package to npm. Pushing the tag runs the [release workflow](./.github/workflows/release.yml), which publishes the GitHub release notes.
- Security issues are handled as described in [SECURITY.md](./SECURITY.md).

## Community

Everyone taking part in the project is expected to follow the [Code of Conduct](./CODE_OF_CONDUCT.md). See [contributing.md](./contributing.md) to get started.
