import fs from 'fs'
import path from 'path'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import {babel} from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import {terser} from 'rollup-plugin-terser'
import camelCase from 'camelcase'

const {getBabelOptions} = require('./babelOptions')
const getPackageJson = require('./scripts/get-package-json')

const pkg = getPackageJson()
const rootPath = path.resolve('./')

const input = path.join(rootPath, './src/index.js')

const name = camelCase(pkg.name)

const globals = {
  jss: 'jss',
  'react-jss': 'reactJss',
  react: 'React'
}

Object.keys(pkg.peerDependencies || {}).forEach((key) => {
  if (!(key in globals)) {
    throw new Error(`Missing peer dependency "${key}" in the globals map.`)
  }
})

const external = (id) => !id.startsWith('.') && !path.isAbsolute(id)

const getBabelConfig = ({useESModules}) => ({
  babelHelpers: 'runtime',
  exclude: /node_modules/,
  babelrc: false,
  configFile: false,
  ...getBabelOptions({useESModules})
})

const commonjsOptions = {
  include: [
    /\/node_modules\/react\//,
    /\/node_modules\/prop-types\//,
    /\/node_modules\/react-display-name\//,
    /\/node_modules\/hoist-non-react-statics\//
  ],
  ignoreGlobal: true
}

const createFlowBundlePlugin = {
  renderChunk(code, chunk, outputOptions) {
    const file = path.join(rootPath, `${outputOptions.file}.flow`)
    const content = "// @flow\n\nexport * from '../src';"
    fs.writeFileSync(file, content)
  }
}

export default [
  {
    input,
    output: {
      file: `dist/${pkg.name}.js`,
      format: 'umd',
      sourcemap: true,
      exports: 'named',
      name,
      globals
    },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(getBabelConfig({useESModules: true})),
      commonjs(commonjsOptions),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.VERSION': JSON.stringify(pkg.version)
      })
    ]
  },

  {
    input,
    output: {
      file: `dist/${pkg.name}.min.js`,
      format: 'umd',
      exports: 'named',
      name,
      globals
    },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(getBabelConfig({useESModules: true})),
      commonjs(commonjsOptions),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.VERSION': JSON.stringify(pkg.version)
      }),
      terser()
    ]
  },

  {
    input,
    output: {file: pkg.main, format: 'cjs', exports: 'named'},
    external,
    plugins: [
      createFlowBundlePlugin,
      babel(getBabelConfig({useESModules: false})),
      replace({'process.env.VERSION': JSON.stringify(pkg.version)})
    ]
  },

  {
    input,
    output: {file: pkg.module, format: 'esm'},
    external,
    plugins: [
      babel(getBabelConfig({useESModules: true})),
      replace({'process.env.VERSION': JSON.stringify(pkg.version)})
    ]
  },

  {
    input,
    output: {file: pkg.unpkg, format: 'esm'},
    plugins: [
      nodeResolve(),
      babel(getBabelConfig({useESModules: true})),
      commonjs(commonjsOptions),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.VERSION': JSON.stringify(pkg.version)
      })
    ]
  }
]
