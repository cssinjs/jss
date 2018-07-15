module.exports = {
  presets: [['@babel/preset-env', {modules: process.env.MODULES}], '@babel/preset-flow'],

  plugins: [
    'transform-inline-environment-variables',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from'
  ],
  env: {
    test: {
      plugins: ['rewire']
    }
  }
}
