import path from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import {sizeSnapshot} from 'rollup-plugin-size-snapshot'

const matchSnapshot = process.env.SNAPSHOT === 'match'

const modulePath = path.resolve('./')
const input = path.join(modulePath, './src/index.js')
// eslint-disable-next-line import/no-dynamic-require
const pkg = require(path.join(modulePath, 'package.json'))

const getBabelOptions = () => ({
  exclude: '**/node_modules/**',
  babelrc: false,
  presets: [['env', {modules: false}], 'stage-0', 'flow'],
  plugins: ['external-helpers']
})

export default  [
  {
    input,
    output: {
      file: `dist/${pkg.name}.js`,
      format: 'umd',
      sourcemap: true,
      exports: 'named',
      name: pkg.name
    },
    plugins: [
      nodeResolve(),
      commonjs({include: '**/node_modules/**'}),
      babel(getBabelOptions()),
      replace({'process.env.NODE_ENV': JSON.stringify('development')}),
      sizeSnapshot({matchSnapshot})
    ]
  },

  {
    input,
    output: {
      file: `dist/${pkg.name}.min.js`,
      format: 'umd',
      exports: 'named',
      name: pkg.name
    },
    plugins: [
      nodeResolve(),
      commonjs({include: '**/node_modules/**'}),
      babel(getBabelOptions()),
      replace({'process.env.NODE_ENV': JSON.stringify('production')}),
      sizeSnapshot({matchSnapshot}),
      uglify()
    ]
  }
]
