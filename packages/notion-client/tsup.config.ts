import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    outDir: 'build',
    target: 'node14.8',
    platform: 'node',
    format: ['esm'],
    splitting: false,
    sourcemap: true,
    minify: true,
    shims: false
  },
  {
    entry: ['src/browser.ts'],
    outDir: 'build',
    target: 'es2015',
    platform: 'browser',
    format: ['esm'],
    splitting: false,
    sourcemap: true,
    minify: true,
    shims: false
  }
])
