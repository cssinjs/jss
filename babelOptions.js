// Only syntax Rolldown cannot parse and the warning/invariant rewrite belong
// in the source pass. Preserve JSX and modern JavaScript for native transforms.
exports.getBabelOptions = () => ({
  parserOpts: {plugins: ['jsx', 'classProperties']},
  plugins: ['@babel/transform-flow-strip-types', 'dev-expression']
})
