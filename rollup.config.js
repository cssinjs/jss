import path from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import {sizeSnapshot} from 'rollup-plugin-size-snapshot'
import nodeGlobals from 'rollup-plugin-node-globals'

const {getPackageJson} = require('./scripts/get-package-json')

const pkg = getPackageJson()
const rootPath = path.resolve('./')
const matchSnapshot = process.env.SNAPSHOT === 'match'

function toCamelCase(name) {
  return name.replace(/-(\w)/g, (match, letter) => letter.toUpperCase())
}

const input = path.join(rootPath, './src/index.js')

const name = toCamelCase(pkg.name)

const globals = Object.keys(pkg.peerDependencies || {}).reduce(
  (acc, key) => Object.assign({}, acc, {[key]: toCamelCase(key)}),
  {}
)

const getBabelOptions = () => ({
  exclude: '**/node_modules/**',
  babelrc: false,
  presets: [['env', {modules: false}], 'stage-0', 'flow'],
  plugins: ['external-helpers']
})

const commonjsOptions = {
  ignoreGlobal: true
}

const snapshotOptions = {
  matchSnapshot,
  snapshotPath: './.size-snapshot.json'
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
      babel(getBabelOptions()),
      commonjs(commonjsOptions),
      nodeGlobals(),
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
      babel(getBabelOptions()),
      commonjs(commonjsOptions),
      nodeGlobals(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.VERSION': JSON.stringify(pkg.version)
      }),
      sizeSnapshot(snapshotOptions),
      uglify()
    ]
  }
]
