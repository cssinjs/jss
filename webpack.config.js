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
        options: {
          presets: ['@babel/react', '@babel/flow', '@babel/env'],
          plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread']
        }
      }
    ]
  },
  devtool: 'inline-source-map'
}
