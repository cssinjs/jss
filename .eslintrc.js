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
        'no-console': 'off'
      }
    }
  ]
}
