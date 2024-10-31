import { defineConfig, type Options } from 'tsup'

const baseConfig: Options = {
  entry: [
    'src/index.tsx',
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
  shims: false
}

export default defineConfig([
  {
    ...baseConfig,
    outDir: 'build/dev',
    minify: false,
    sourcemap: true,
    dts: true
  },
  {
    ...baseConfig,
    outDir: 'build',
    minify: false,
    sourcemap: false,
    dts: true
  }
])
