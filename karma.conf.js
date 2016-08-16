const assign = require('lodash.assign')
const webpackConfig = require('./webpack.config')
const browsers = require('./browsers')
const plugins = require('./plugins')

const isBench = process.env.BENCHMARK === 'true'
const useCloud = process.env.USE_CLOUD === 'true'
const browserStackUserName = process.env.BROWSER_STACK_USERNAME
const browserStackAccessKey = process.env.BROWSER_STACK_ACCESS_KEY
const isTravis = process.env.TRAVIS
const travisBuildNumber = process.env.TRAVIS_BUILD_NUMBER
const travisBuildId = process.env.TRAVIS_BUILD_ID
const travisJobNumber = process.env.TRAVIS_JOB_NUMBER

const filesForWebpack = plugins
  .map(name => `node_modules/${name}/tests.webpack.js`)
  .concat([
    'tests.webpack.js'
  ])

module.exports = (config) => {
  config.set({
    customLaunchers: browsers,
    browsers: ['Chrome', 'Firefox', 'Safari'],
    frameworks: ['mocha'],
    files: [
      'node_modules/es5-shim/es5-shim.js',
      'node_modules/es5-shim/es5-sham.js'
    ].concat(filesForWebpack),
    preprocessors: filesForWebpack.reduce((map, file) => {
      map[file] = ['webpack', 'sourcemap']
      return map
    }, {}),
    webpack: assign(webpackConfig, {
      devtool: 'inline-source-map'
    }),
    webpackServer: {
      noInfo: true
    },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      file: 'coverage.json',
      type: 'json'
    }
  })
  if (isBench) {
    assign(config, {
      browsers: ['Chrome'],
      frameworks: ['benchmark'],
      files: ['benchmark/**/*.js'],
      preprocessors: {'benchmark/**/*.js': ['webpack']},
      reporters: ['benchmark'],
      // Some tests are slow.
      browserNoActivityTimeout: 20000
    })
  }

  if (useCloud) {
    assign(config, {
      browsers: Object.keys(browsers),
      browserDisconnectTolerance: 3,
      // My current OS plan allows max 2 parallel connections.
      concurrency: 2,
      retryLimit: 3
    })

    config.browserStack = {
      username: browserStackUserName,
      accessKey: browserStackAccessKey,
      captureTimeout: 10000
    }

    if (isTravis) {
      assign(config.browserStack, {
        build: `TRAVIS #${travisBuildNumber} (${travisBuildId})`,
        name: travisJobNumber
      })
    }
  }
}
