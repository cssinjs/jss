/*
  TODO We are migrating to rollup, webpack is still used for tests and needs to be migrated.
*/

const webpack = require('webpack')

const env = process.env.NODE_ENV

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env)
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
