# Release Guide for @ahmedelkady/notion-client

This guide covers how to release new versions of the `@ahmedelkady/notion-client` package.

## Prerequisites

1. **npm Authentication**: Make sure you're logged in to npm
   ```bash
   npm whoami  # Should show 'ahmedelkady'
   ```

2. **Dependencies Built**: Ensure workspace dependencies are built
   ```bash
   # From root directory
   pnpm --filter notion-types build
   pnpm --filter notion-utils build
   ```

## Release Process

### 1. Prepare the Release

```bash
# Navigate to the package directory
cd packages/notion-client

# Install dependencies (if needed)
pnpm install

# Build the package
pnpm build

# Run all tests
pnpm test
```

### 2. Release New Version

For different types of releases:

**Patch Release** (7.3.0 → 7.3.1) - Bug fixes:
```bash
pnpm release:patch
```

**Minor Release** (7.3.0 → 7.4.0) - New features:
```bash
pnpm release:minor
```

**Major Release** (7.3.0 → 8.0.0) - Breaking changes:
```bash
pnpm release:major
```

### 3. Manual Release (Alternative)

If you prefer manual control:

```bash
# 1. Update version manually
npm version patch  # or minor/major

# 2. Build
pnpm build

# 3. Test
pnpm test

# 4. Publish
npm publish --access public
```

## Package Information

- **Package Name**: `@ahmedelkady/notion-client`
- **Current Version**: 7.3.0
- **npm Registry**: https://www.npmjs.com/package/@ahmedelkady/notion-client
- **Repository**: https://github.com/rimonhanna/react-notion-x

## Dependencies

This package depends on:
- `notion-types` (workspace dependency)
- `notion-utils` (workspace dependency)
- `ky` (external)
- `p-map` (external)

## Troubleshooting

### Build Errors
If you get type errors, make sure dependencies are built:
```bash
cd ../../  # Go to root
pnpm --filter notion-types build
pnpm --filter notion-utils build
cd packages/notion-client
pnpm build
```

### Publish Errors
- Ensure you're logged in: `npm whoami`
- For scoped packages, use `--access public`
- Check version conflicts on npm registry

### Linting Errors
Fix linting issues before publishing:
```bash
pnpm test:lint  # Check for issues
# Fix manually or use IDE auto-fix
```

## Post-Release

After publishing:
1. Verify the package is available: https://www.npmjs.com/package/@ahmedelkady/notion-client
2. Test installation: `npm install @ahmedelkady/notion-client`
3. Update documentation if needed
4. Consider tagging the Git commit: `git tag v7.3.1 && git push --tags` 