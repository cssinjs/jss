import path from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import {sizeSnapshot} from 'rollup-plugin-size-snapshot'
import globals from 'rollup-plugin-node-globals'
import pkg from './package.json'

const matchSnapshot = process.env.SNAPSHOT === 'match'
const packagesPath = path.join(__dirname, 'packages')

const base = {
  input: path.join(packagesPath, 'jss/src/index.js'),
  plugins: [
    nodeResolve(),
    commonjs({include: '**/node_modules/**', ignoreGlobal: true}),
    babel({
      exclude: '**/node_modules/**',
      babelrc: false,
      presets: [['env', {modules: false}], 'stage-0', 'flow'],
      plugins: ['external-helpers']
    }),
    globals(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __VERSION__: JSON.stringify(pkg.version)
    }),
    sizeSnapshot({
      matchSnapshot,
      snapshotPath: path.join(packagesPath, 'jss/.size-snapshot.json')
    })
  ]
}

export default [
  {
    ...base,
    output: {
      file: 'dist/jss.js',
      format: 'umd',
      sourcemap: true,
      exports: 'named',
      name: pkg.name
    }
  },
  {
    ...base,
    plugins: [...base.plugins, uglify()],
    output: {
      file: 'dist/jss.min.js',
      format: 'umd',
      exports: 'named',
      name: pkg.name
    }
  }
]
