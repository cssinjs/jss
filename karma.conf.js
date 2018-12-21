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

module.exports = config => {
  config.set({
    customLaunchers: browsers,
    browsers: ['Chrome'],
    frameworks: ['mocha'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/es5-shim/es5-shim.js',
      'node_modules/es5-shim/es5-sham.js',
      'node_modules/css.escape/css.escape.js',
      'node_modules/raf/polyfill.js',
      './packages/jss/tests/index.js',
      './packages/jss-plugin-rule-value-function/src/index.test.js',
      './packages/jss-plugin-rule-value-observable/src/index.test.js',
      './packages/jss-plugin-expand/src/index.test.js',
      './packages/jss-plugin-default-unit/src/index.test.js',
      './packages/jss-plugin-camel-case/src/index.test.js',
      './packages/jss-plugin-nested/src/index.test.js',
      './packages/jss-plugin-extend/src/index.test.js',
      './packages/jss-plugin-compose/src/index.test.js',
      './packages/jss-plugin-global/src/index.test.js',
      './packages/jss-plugin-vendor-prefixer/src/index.test.js',
      './packages/jss-plugin-cache/src/index.test.js',
      './packages/jss-plugin-props-sort/src/index.test.js',
      './packages/jss-plugin-isolate/src/index.test.js',
      './packages/jss-plugin-template/src/index.test.js',
      './packages/react-jss/tests/theming.js',
      './packages/react-jss/tests/dynamic-styles.js',
      './packages/react-jss/src/index.test.js',
      './packages/react-jss/src/compose.test.js',
      './packages/react-jss/src/JssProvider.test.js',
      './packages/react-jss/src/injectSheet.test.js'
    ],
    preprocessors: {
      'node_modules/raf/polyfill.js': ['webpack'],
      './packages/**/*.js': ['webpack', 'sourcemap']
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
      // My current OS plan allows max 5 parallel connections.
      concurrency: 5,
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
