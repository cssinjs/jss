var webpack = require('webpack')
var assign = require('lodash/object/assign')
var webpackConfig = require('./webpack.config')
var browsers = require('./browsers')

var isBench = process.env.BENCHMARK === 'true'
var useCloud = process.env.USE_CLOUD === 'true'
var nodeVersionBrowserStack = parseInt(process.env.NODE_VERSION_BROWSERSTACK, 10)
var browserStackUserName = process.env.BROWSER_STACK_USERNAME
var browserStackAccessKey = process.env.BROWSER_STACK_ACCESS_KEY
var isTravis = process.env.TRAVIS
var travisBuildNumber = process.env.TRAVIS_BUILD_NUMBER
var travisBuildId = process.env.TRAVIS_BUILD_ID
var travisJobNumber = process.env.TRAVIS_JOB_NUMBER

module.exports = function (config) {
  config.set({
    customLaunchers: browsers,
    browsers: ['Chrome', 'Firefox', 'Safari'],
    frameworks: ['mocha'],
    files: [
      'node_modules/es5-shim/es5-shim.js',
      'node_modules/es5-shim/es5-sham.js',
      'tests.webpack.js'
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    webpack: assign(webpackConfig, {
      devtool: 'inline-source-map'
    }),
    webpackServer: {
      noInfo: true
    },
    reporters: ['mocha']
  })

  if (isBench) {
    assign(config, {
      browsers: ['Chrome'],
      frameworks: ['benchmark'],
      files: ['benchmark/**/*.js'],
      preprocessors: {'benchmark/**/*.js': ['webpack']},
      reporters: ['benchmark']
    })
  }

  if (useCloud) {
    // We support multiple node versions in travis.
    // To reduce load on browserstack, we only run real browsers in one node version.
    var useRealBrowsers = parseInt(process.version.substr(1), 10) === nodeVersionBrowserStack
    if (useRealBrowsers) {
      config.browsers = Object.keys(browsers)
    } else {
      config.browsers = ['PhantomJS']
    }

    assign(config, {
      browserDisconnectTimeout: 10000,
      browserDisconnectTolerance: 3,
      browserNoActivityTimeout: 30000,
      captureTimeout: 200000
    })

    config.browserStack = {
      username: browserStackUserName,
      accessKey: browserStackAccessKey,
      pollingTimeout: 10000
    }

    if (isTravis) {
      assign(config.browserStack, {
        build: 'TRAVIS #' + travisBuildNumber + ' (' + travisBuildId + ')',
        name: travisJobNumber
      })
    }
  }
}
