'use strict'

var webpack = require('webpack')

process.env.VERSION = require('./package.json').version

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VERSION': JSON.stringify(process.env.VERSION),
    __DEV__: process.env.NODE_ENV === 'development',
    __TEST__: process.env.NODE_ENV === 'test'
  })
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = {
  output: {
    library: 'jss',
    libraryTarget: 'umd'
  },
  plugins: plugins,
  module: {
    loaders: [
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

if (process.env.NODE_ENV === 'test') {
  module.exports.externals = {'../src': 'jss'}
}
