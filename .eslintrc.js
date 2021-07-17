module.exports = {
  extends: ['jss', 'prettier', 'prettier/react'],
  parser: 'babel-eslint',
  env: {
    mocha: true,
    browser: true
  },
  globals: {
    benchmark: true,
    __VERSION__: true,
    CSS: true
  },
  overrides: [
    {
      files: ['docs/*.md', 'docs/**/*.md'],
      rules: {
        'no-console': 'off',
        'import/extensions': 'off'
      }
    },
    {
      files: ['examples/**/*.js'],
      rules: {
        'import/no-unresolved': 'off',
        'react/prop-types': 'off',
        'no-console': 'off',
        'import/extensions': 'off',
        'import/prefer-default-export': 'off',
        'jsx-a11y/label-has-for': 'off',
        'jsx-a11y/label-has-associated-control': 'off'
      }
    }
  ]
}
