import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  target: 'es2018',
  platform: 'browser',
  format: ['esm'],
  sourcemap: true,
  minify: false,
  shims: false,
  dts: true,
  clean: true
})
