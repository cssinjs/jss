const webpack = require('./webpack.config')
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
      './polyfills.js',
      './packages/*/tests/*.js',
      './packages/*/tests/**/*.js',
      './packages/*/src/**/*.test.js'
    ],
    preprocessors: {
      './polyfills.js': ['webpack', 'sourcemap'],
      './packages/**/*.js': ['webpack', 'sourcemap']
    },
    webpack,
    webpackMiddleware: {
      stats: 'errors-only'
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
      // Using a fixed position for a file name, m.b. should use an args parser later.
      files: [process.argv[4] || 'packages/jss/benchmark/**/*.js'],
      preprocessors: {'packages/jss/benchmark/**/*.js': ['webpack']},
      reporters: ['benchmark'],
      // Some tests are slow.
      browserNoActivityTimeout: 20000
    })
  }

  if (useCloud) {
    Object.assign(config, {
      browsers: Object.keys(browsers),
      browserDisconnectTolerance: 3,
      // My current OS plan allows max 10 parallel connections.
      concurrency: 10,
      retryLimit: 5,
      browserNoActivityTimeout: 100000
    })

    config.browserStack = {
      username: browserStackUserName,
      accessKey: browserStackAccessKey,
      captureTimeout: 30000
    }

    if (isTravis) {
      Object.assign(config.browserStack, {
        build: `TRAVIS #${travisBuildNumber} (${travisBuildId})`,
        name: travisJobNumber
      })
    }
  }
}
