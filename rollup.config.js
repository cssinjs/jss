import fs from 'fs'
import path from 'path'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import {babel} from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import {terser} from 'rollup-plugin-terser'
import {sizeSnapshot} from 'rollup-plugin-size-snapshot'
import camelCase from 'camelcase'

const {getBabelOptions} = require('./babelOptions')
const getPackageJson = require('./scripts/get-package-json')

const pkg = getPackageJson()
const rootPath = path.resolve('./')
const matchSnapshot = process.env.MATCH_SNAPSHOT === 'true'
const logSnapshot = process.env.LOG_SNAPSHOT === 'true'

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

const snapshotOptions = {
  matchSnapshot,
  printInfo: logSnapshot,
  snapshotPath: './.size-snapshot.json'
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
      }),
      sizeSnapshot(snapshotOptions)
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
      sizeSnapshot(snapshotOptions),
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
      replace({'process.env.VERSION': JSON.stringify(pkg.version)}),
      sizeSnapshot(snapshotOptions)
    ]
  },

  {
    input,
    output: {file: pkg.module, format: 'esm'},
    external,
    plugins: [
      babel(getBabelConfig({useESModules: true})),
      replace({'process.env.VERSION': JSON.stringify(pkg.version)}),
      sizeSnapshot(snapshotOptions)
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
      // size-snapshot is disabled until this is resolved:
      // https://github.com/TrySound/rollup-plugin-size-snapshot/issues/24
    ]
  }
]
