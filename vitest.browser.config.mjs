import {readFileSync, readdirSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {transformAsync} from '@babel/core'
import {defineConfig} from 'vitest/config'
import {playwright} from '@vitest/browser-playwright'

const {version} = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  resolve: {
    // Exercise workspace source, including imports between packages, without a prior build.
    alias: readdirSync(new URL('./packages/', import.meta.url)).map((name) => ({
      find: new RegExp(`^${name}$`),
      replacement: fileURLToPath(new URL(`./packages/${name}/src/index.js`, import.meta.url))
    }))
  },
  plugins: [
    {
      name: 'react-jss-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (!id.includes('/packages/react-jss/') || !id.endsWith('.js')) return null
        return transformAsync(code, {
          filename: id,
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-react'],
          sourceMaps: true
        })
      }
    }
  ],
  optimizeDeps: {
    // JSX in React-JSS's .js files is transformed by the plugin above, not the dependency scanner.
    noDiscovery: true,
    // Resolve nested dependencies through their owners instead of relying on hoisting.
    include: [
      'react-jss > @babel/runtime/helpers/esm/assertThisInitialized',
      'react-jss > @babel/runtime/helpers/esm/createClass',
      'react-jss > @babel/runtime/helpers/esm/extends',
      'react-jss > @babel/runtime/helpers/esm/inheritsLoose',
      'react-jss > @babel/runtime/helpers/esm/objectWithoutPropertiesLoose',
      'react-jss > @emotion/is-prop-valid',
      'common-tags',
      'react-jss > hoist-non-react-statics',
      'jss > is-in-browser',
      'react-jss > shallow-equal',
      'jss > tiny-warning',
      'jss-plugin-isolate > css-initials/all',
      'jss-plugin-isolate > css-initials/inherited',
      'jss-plugin-vendor-prefixer > css-vendor',
      'detect-browser',
      'jss-plugin-camel-case > hyphenate-style-name',
      'react',
      'react-dom/server',
      'react-test-renderer',
      'react-jss > styled-system',
      'react-jss > theming',
      'jss-plugin-rule-value-observable > symbol-observable',
      'zen-observable'
    ]
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.VERSION': JSON.stringify(version)
  },
  test: {
    include: ['packages/**/*.browser.test.js'],
    restoreMocks: true,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{browser: 'chromium'}],
      headless: true
    },
    coverage: {
      provider: 'v8',
      include: [
        'packages/jss/src/**/*.js',
        'packages/jss-plugin-*/src/**/*.js',
        'packages/css-jss/src/**/*.js',
        'packages/react-jss/src/**/*.js'
      ],
      exclude: ['**/flow-types/**', '**/flow-types.js', '**/*.test.js'],
      reporter: ['text', 'json'],
      reportsDirectory: 'coverage/vitest-browser'
    }
  }
})
