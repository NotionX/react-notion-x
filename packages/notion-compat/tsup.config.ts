import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  dts: true,
  target: 'node14',
  platform: 'node',
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: false
})
