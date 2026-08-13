import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/cli.ts'],
  outDir: 'build',
  target: 'node18',
  platform: 'node',
  format: ['esm'],
  sourcemap: true,
  minify: false,
  dts: true,
  clean: true
})
