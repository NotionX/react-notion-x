import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.tsx',
    'src/third-party/code.tsx',
    'src/third-party/collection.tsx',
    'src/third-party/equation.tsx',
    'src/third-party/modal.tsx',
    'src/third-party/pdf.tsx'
  ],
  outDir: 'build',
  target: 'es2015',
  platform: 'browser',
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: false
})
