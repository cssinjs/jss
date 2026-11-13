// Gzip budgets start at the measured baseline plus 10%, rounded up to 10 B.
// Independent budgets for the published production UMD artifacts.
// Do not rebundle these: their peer dependencies are intentionally external.
const artifacts = {
  'css-jss': '7880 B',
  jss: '7560 B',
  'jss-plugin-cache': '400 B',
  'jss-plugin-camel-case': '560 B',
  'jss-plugin-compose': '500 B',
  'jss-plugin-default-unit': '1380 B',
  'jss-plugin-expand': '1700 B',
  'jss-plugin-extend': '800 B',
  'jss-plugin-global': '1030 B',
  'jss-plugin-isolate': '2960 B',
  'jss-plugin-nested': '860 B',
  'jss-plugin-props-sort': '380 B',
  'jss-plugin-rule-value-function': '510 B',
  'jss-plugin-rule-value-observable': '590 B',
  'jss-plugin-template': '420 B',
  'jss-plugin-vendor-prefixer': '2770 B',
  'jss-preset-default': '7490 B',
  'jss-starter-kit': '10560 B',
  'react-jss': '15350 B'
}

module.exports = [
  ...Object.entries(artifacts).map(([name, limit]) => ({
    name: `${name} / production UMD`,
    path: `packages/${name}/dist/${name}.min.js`,
    limit,
    rolldown: false,
    gzip: true
  })),
  {
    name: 'JSS / create consumer',
    path: 'packages/jss/dist/jss.esm.js',
    import: '{ create }',
    limit: '7080 B',
    gzip: true
  },
  {
    name: 'JSS / default preset consumer',
    path: 'scripts/size/default-preset.js',
    limit: '13850 B',
    gzip: true
  },
  {
    name: 'React-JSS / createUseStyles consumer (React external)',
    path: 'packages/react-jss/dist/react-jss.esm.js',
    import: '{ createUseStyles }',
    ignore: ['react'],
    limit: '18090 B',
    gzip: true
  }
]
