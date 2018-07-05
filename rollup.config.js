import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import {sizeSnapshot} from 'rollup-plugin-size-snapshot'
import globals from 'rollup-plugin-node-globals'
import pkg from './package.json'

const matchSnapshot = process.env.SNAPSHOT === 'match'

const input = matchSnapshot ? './packages/jss/src/index.js' : './src/index.js'

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
      commonjs({include: '**/node_modules/**', ignoreGlobal: true}),
      babel(getBabelOptions()),
      globals(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        __VERSION__: JSON.stringify(pkg.version)
      }),
      sizeSnapshot({
        matchSnapshot,
        snapshotPath: './packages/jss/.size-snapshot.json'
      })
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
      commonjs({include: '**/node_modules/**', ignoreGlobal: true}),
      babel(getBabelOptions()),
      globals(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        __VERSION__: JSON.stringify(pkg.version)
      }),
      sizeSnapshot({
        matchSnapshot,
        snapshotPath: './packages/jss/.size-snapshot.json'
      }),
      uglify()
    ]
  }
]
