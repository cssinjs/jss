import fs from 'fs'
import path from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import nodeGlobals from 'rollup-plugin-node-globals'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import {uglify} from 'rollup-plugin-uglify'
import {sizeSnapshot} from 'rollup-plugin-size-snapshot'
import camelCase from 'camelcase'

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

Object.keys(pkg.peerDependencies || {}).forEach(key => {
  if (!(key in globals)) {
    throw new Error(`Missing peer dependency "${key}" in the globals map.`)
  }
})

const external = id => !id.startsWith('.') && !id.startsWith('/')

const getBabelOptions = ({useESModules}) => ({
  exclude: /node_modules/,
  babelrc: false,
  runtimeHelpers: true,
  presets: [['@babel/env', {loose: true}], '@babel/flow', '@babel/react'],
  plugins: [
    ['@babel/proposal-class-properties', {loose: true}],
    ['@babel/transform-runtime', {useESModules}],
    ['@babel/plugin-proposal-export-namespace-from'],
    ['dev-expression']
  ]
})

const commonjsOptions = {
  ignoreGlobal: true,
  // The CommonJS plugin can't resolve the exports in `react` automatically.
  // https://github.com/rollup/rollup-plugin-commonjs#custom-named-exports
  // https://github.com/reduxjs/react-redux/issues/643#issuecomment-285008041
  namedExports: {
    react: ['Component', 'createContext']
  }
}

const snapshotOptions = {
  matchSnapshot,
  printInfo: logSnapshot,
  snapshotPath: './.size-snapshot.json'
}

const createFlowBundlePlugin = {
  transformBundle(code, outputOptions) {
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
      babel(getBabelOptions({useESModules: true})),
      commonjs(commonjsOptions),
      nodeGlobals({process: false}),
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
      babel(getBabelOptions({useESModules: true})),
      commonjs(commonjsOptions),
      nodeGlobals({process: false}),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.VERSION': JSON.stringify(pkg.version)
      }),
      sizeSnapshot(snapshotOptions),
      uglify()
    ]
  },

  {
    input,
    output: {file: pkg.main, format: 'cjs', exports: 'named'},
    external,
    plugins: [
      createFlowBundlePlugin,
      babel(getBabelOptions({useESModules: false})),
      nodeGlobals({process: false}),
      replace({'process.env.VERSION': JSON.stringify(pkg.version)}),
      sizeSnapshot(snapshotOptions)
    ]
  },

  {
    input,
    output: {file: pkg.module, format: 'esm'},
    external,
    plugins: [
      babel(getBabelOptions({useESModules: true})),
      nodeGlobals({process: false}),
      replace({'process.env.VERSION': JSON.stringify(pkg.version)}),
      sizeSnapshot(snapshotOptions)
    ]
  },

  {
    input,
    output: {file: pkg.unpkg, format: 'esm'},
    plugins: [
      nodeResolve(),
      babel(getBabelOptions({useESModules: true})),
      commonjs(commonjsOptions),
      nodeGlobals({process: false}),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.VERSION': JSON.stringify(pkg.version)
      })
      // size-snapshot is disabled until this is resolved:
      // https://github.com/TrySound/rollup-plugin-size-snapshot/issues/24
    ]
  }
]
