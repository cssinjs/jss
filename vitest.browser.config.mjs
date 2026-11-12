import {readFileSync} from 'node:fs'
import {defineConfig} from 'vitest/config'
import {playwright} from '@vitest/browser-playwright'

const {version} = JSON.parse(readFileSync(new URL('./lerna.json', import.meta.url), 'utf8'))

export default defineConfig({
  optimizeDeps: {
    include: [
      '@babel/runtime/helpers/esm/assertThisInitialized',
      '@babel/runtime/helpers/esm/createClass',
      '@babel/runtime/helpers/esm/extends',
      '@babel/runtime/helpers/esm/inheritsLoose',
      '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose',
      'css-initials/all',
      'css-initials/inherited',
      'css-vendor',
      'detect-browser',
      'hyphenate-style-name',
      'symbol-observable',
      'zen-observable'
    ]
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.VERSION': JSON.stringify(version)
  },
  test: {
    include: [
      'packages/jss/tests/**/*.browser.test.js',
      'packages/jss-plugin-*/src/**/*.browser.test.js'
    ],
    restoreMocks: true,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{browser: 'chromium'}],
      headless: true
    },
    coverage: {
      provider: 'v8',
      include: ['packages/jss/src/**/*.js', 'packages/jss-plugin-*/src/**/*.js'],
      exclude: ['packages/jss/src/flow-types/**', '**/*.browser.test.js'],
      reporter: ['text', 'json'],
      reportsDirectory: 'coverage/vitest-browser'
    }
  }
})
