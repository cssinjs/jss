import babel from 'rollup-plugin-babel'

export default {
  name: 'jss',
  input: 'src/index.js',
  output: {
    format: 'es',
    file: 'es/Jss.js',
  },
  external: [
    'warning',
    'is-in-browser',
  ],
  plugins: [
    babel({
      babelrc: false,
      exclude: '**/node_modules/**',
      presets: [
        ['es2015', {modules: false}],
        'stage-0'
      ],
      plugins: [
        'external-helpers',
        'transform-es3-member-expression-literals',
        'transform-es3-property-literals',
        'transform-flow-strip-types',
        'inline-version',
      ],
    }),
  ],
}