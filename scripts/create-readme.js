const fs = require('fs')

const getPkg = require('./get-package-json')

const pkg = getPkg()

function getDocsPath() {
  switch (pkg.name) {
    case 'jss':
      return 'setup'
    default:
      return pkg.name
  }
}

const readmeContent = `# ${pkg.name}

> ${pkg.description}

See our website [${pkg.name}](https://cssinjs.org/${getDocsPath()}?v=v${
  pkg.version
}) for more information.

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
  fs.writeFileSync('./README.md', readmeContent)
}

module.exports = createReadme
