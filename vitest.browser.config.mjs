import {readFileSync} from 'node:fs'
import {defineConfig} from 'vitest/config'
import {playwright} from '@vitest/browser-playwright'

const {version} = JSON.parse(readFileSync(new URL('./lerna.json', import.meta.url), 'utf8'))

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.VERSION': JSON.stringify(version)
  },
  test: {
    include: ['packages/jss/tests/**/*.browser.test.js'],
    restoreMocks: true,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{browser: 'chromium'}],
      headless: true
    },
    coverage: {
      provider: 'v8',
      include: ['packages/jss/src/**/*.js'],
      exclude: ['packages/jss/src/flow-types/**'],
      reporter: ['text', 'json'],
      reportsDirectory: 'coverage/vitest-jss'
    }
  }
})
