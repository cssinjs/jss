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

const readmeContent = `# ${pkg.name}

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
