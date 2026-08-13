import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'build',
  target: 'node18',
  platform: 'node',
  format: ['esm'],
  sourcemap: true,
  minify: false,
  shims: false,
  dts: true,
  clean: true
})
