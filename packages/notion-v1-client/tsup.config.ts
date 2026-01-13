import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  target: 'es2018',
  platform: 'node',
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: false,
  dts: true
})
