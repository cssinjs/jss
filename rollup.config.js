import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const env = process.env.NODE_ENV
const isProd = env === 'production'
const isDev = env === 'development'
const isTest = env === 'test'

export default {
  entry: 'src/index.js',
  format: 'umd',
  dest: `dist/jss${isProd ? '.min' : ''}.js`,
  moduleName: 'jss',
  exports: 'named',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    resolve({jsnext: true, main: true}),
    commonjs({include: 'node_modules/**'}),
    babel({
      exclude: 'node_modules/**'
    }),
    isProd ? uglify() : null
  ].filter(Boolean)
}
