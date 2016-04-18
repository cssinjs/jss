'use strict'

var webpack = require('webpack')

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    __DEV__: process.env.NODE_ENV === 'development',
    __TEST__: process.env.NODE_ENV === 'test',
    '__VERSION__': JSON.stringify(require('./package.json').version)
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
