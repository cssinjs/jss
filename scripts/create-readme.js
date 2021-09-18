const fs = require('fs')

const getPkg = require('./get-package-json')
const {README_FILENAME} = require('./constants')

const pkg = getPkg()

function getDocsPath() {
  switch (pkg.name) {
    case 'jss':
      return 'setup'
    default:
      return pkg.name
  }
}

const docs = `[${pkg.name}](https://cssinjs.org/${getDocsPath()}?v=v${pkg.version})`
const npm = `https://npmjs.org/package/${pkg.name}`

const readmeContent = `# ${pkg.name}

[![Version](https://img.shields.io/npm/v/${pkg.name}.svg?style=flat)](${npm})
[![License](https://img.shields.io/npm/l/${pkg.name}.svg?style=flat)](https://github.com/cssinjs/jss/blob/master/LICENSE)
[![Downlodas](https://img.shields.io/npm/dm/${pkg.name}.svg?style=flat)](${npm})
[![Size](https://img.shields.io/bundlephobia/minzip/${pkg.name}.svg?style=flat)](${npm})
[![Dependencies](https://img.shields.io/david/cssinjs/jss.svg?path=packages%2F${pkg.name}&style=flat)](${npm})

> ${pkg.description}

See our website ${docs} for more information.

## Install

Using npm:

\`\`\`sh
npm install ${pkg.name}
\`\`\`

or using yarn:

\`\`\`sh
yarn add ${pkg.name}
\`\`\`
`

function createReadme() {
  fs.writeFileSync(README_FILENAME, readmeContent)
}

module.exports = createReadme
