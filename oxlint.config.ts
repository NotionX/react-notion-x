import config from '@fisch0920/config/oxlint'

export default {
  extends: [config],
  rules: {
    'no-constant-condition': 'off',
    'typescript/consistent-indexed-object-style': 'off',
    'vitest/require-to-throw-message': 'off',
    'anti-slop/no-known-value-widening': 'off',
    'anti-slop/no-unsafe-dictionary-type': 'off',
    'anti-slop/no-chained-type-assertions': 'off',
    'anti-slop/no-unknown-parameters': 'off',
    'react/immutability': 'off',
    'react/set-state-in-effect': 'off',
    'react/refs': 'off'
  }
}
