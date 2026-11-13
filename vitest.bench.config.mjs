import {defineConfig, mergeConfig} from 'vitest/config'
import browserConfig from './vitest.browser.config.mjs'

export default mergeConfig(
  browserConfig,
  defineConfig({
    test: {
      benchmark: {
        include: ['packages/**/benchmark/**/*.bench.js']
      }
    }
  })
)
