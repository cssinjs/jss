import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import {sizeSnapshot} from 'rollup-plugin-size-snapshot'
import pkg from './package.json'

const matchSnapshot = process.env.SNAPSHOT === 'match'

const input = './src/index.js'

const getBabelOptions = () => ({
  exclude: '**/node_modules/**',
  babelrc: false,
  presets: [['env', {modules: false}], 'stage-0', 'flow'],
  plugins: ['external-helpers']
})

export default [
  {
    input,
    output: {
      file: 'dist/jss.js',
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
      sizeSnapshot({ matchSnapshot })
    ]
  },

  {
    input,
    output: {
      file: 'dist/jss.min.js',
      format: 'umd',
      exports: 'named',
      name: pkg.name
    },
    plugins: [
      nodeResolve(),
      commonjs({include: '**/node_modules/**'}),
      babel(getBabelOptions()),
      replace({'process.env.NODE_ENV': JSON.stringify('production')}),
      sizeSnapshot({ matchSnapshot }),
      uglify()
    ]
  }
]
