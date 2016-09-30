const webpackConfig = require('./webpack.config')
const browsers = require('./browsers')

const isBench = process.env.BENCHMARK === 'true'
const useCloud = process.env.USE_CLOUD === 'true'
const browserStackUserName = process.env.BROWSER_STACK_USERNAME
const browserStackAccessKey = process.env.BROWSER_STACK_ACCESS_KEY
const isTravis = process.env.TRAVIS
const travisBuildNumber = process.env.TRAVIS_BUILD_NUMBER
const travisBuildId = process.env.TRAVIS_BUILD_ID
const travisJobNumber = process.env.TRAVIS_JOB_NUMBER

module.exports = (config) => {
  config.set({
    customLaunchers: browsers,
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    files: [
      'node_modules/es5-shim/es5-shim.js',
      'node_modules/es5-shim/es5-sham.js',
      'tests/index.js',
    ],
    preprocessors: {
      'tests/index.js': ['webpack', 'sourcemap'],
    },
    webpack: Object.assign(webpackConfig, {
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
    Object.assign(config, {
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
    Object.assign(config, {
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
      Object.assign(config.browserStack, {
        build: `TRAVIS #${travisBuildNumber} (${travisBuildId})`,
        name: travisJobNumber
      })
    }
  }
}
