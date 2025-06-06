import { config } from '@fisch0920/config/eslint'

export default [
  ...config,
  {
    ignores: ['.snapshots/', '.next/', '.vercel/', 'build/', 'docs/']
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'react/prop-types': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/filename-case': 'off',
      'no-process-env': 'off',
      'array-callback-return': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-a11y/interactive-supports-focus': 'off',
      '@typescript-eslint/naming-convention': 'off'
    }
  }
]
