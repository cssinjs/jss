/*
  TODO We are migrating to rollup, webpack is still used for tests and needs to be migrated.
*/

const webpack = require('webpack')
const lerna = require('./lerna.json')

const plugins = [
  new webpack.DefinePlugin({
    'process.env.VERSION': JSON.stringify(lerna.version)
  })
]

const babelPlugins = ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread']

if (process.env.BENCHMARK) {
  babelPlugins.push('dev-expression')
}

module.exports = {
  mode: process.env.BENCHMARK ? 'production' : 'none',
  entry: './packages/jss/src/index',
  output: {
    library: 'jss',
    libraryTarget: 'umd'
  },
  optimization: {
    nodeEnv: process.env.BENCHMARK ? 'production' : false
  },
  plugins,
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        options: {
          presets: ['@babel/react', '@babel/flow', '@babel/env'],
          plugins: babelPlugins
        }
      }
    ]
  },
  devtool: 'inline-source-map'
}
