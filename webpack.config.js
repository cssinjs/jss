/*
  TODO We are migrating to rollup, webpack is still used for tests and needs to be migrated.
*/

const webpack = require('webpack')
const path = require('path')

const env = process.env.NODE_ENV
const isProd = env === 'production'
const isDev = env === 'development'
const isTest = env === 'test'

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env),
    __DEV__: isDev,
    __TEST__: isTest
  })
]

if (isProd) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}

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
  devtool: 'source-map',
  resolve: {
    alias: {
      // For plugins tests.
      jss: path.join(__dirname, 'packages/jss/src')
    }
  }
}
