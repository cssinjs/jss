/*
  TODO We are migrating to rollup, webpack is still used for tests and needs to be migrated.
*/

const webpack = require('webpack')
const lerna = require('./lerna.json')
const {getBabelOptions} = require('./babelOptions')

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.VERSION': JSON.stringify(lerna.version)
  })
]

module.exports = {
  mode: 'none',
  entry: './packages/jss/src/index',
  output: {
    library: 'jss',
    libraryTarget: 'umd'
  },
  optimization: {
    nodeEnv: false
  },
  plugins,
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        options: getBabelOptions({useESModules: true})
      }
    ]
  },
  devtool: 'inline-source-map'
}
