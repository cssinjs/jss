module.exports = {
  extends: ['jss', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  rules: {
    'flowtype/define-flow-type': 1,
    'flowtype/use-flow-type': 1,
    'react/no-did-mount-set-state': 0,
    'react/no-did-update-set-state': 0,
    'no-console': [1, {allow: ['warn', 'error', 'info']}],
    'import/no-extraneous-dependencies': 'off',
    'no-param-reassign': ['error', {props: false}],
    'react/destructuring-assignment': 'off',
    'prefer-destructuring': 'off'
  },
  env: {
    mocha: true,
    browser: true
  },
  globals: {
    benchmark: true,
    __VERSION__: true,
    CSS: true
  },
  plugins: ['flowtype']
}
