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

module.exports = {
  entry: './packages/jss/src/index',
  output: {
    library: 'jss',
    libraryTarget: 'umd'
  },
  plugins,
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        loader: 'json-loader',
        test: /\.json$/
      }
    ]
  },
  devtool: 'source-map'
}
