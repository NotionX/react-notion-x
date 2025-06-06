import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/third-party/code.tsx',
    'src/third-party/collection.tsx',
    'src/third-party/equation.tsx',
    'src/third-party/modal.tsx',
    'src/third-party/pdf.tsx'
  ],
  outDir: 'build',
  target: 'es2018',
  platform: 'browser',
  format: ['esm'],
  splitting: false,
  shims: false,
  dts: true,
  minify: false,
  sourcemap: true,
  external: ['react-pdf', 'react', 'react-dom']
})
