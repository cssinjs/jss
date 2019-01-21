const fs = require('fs')

const getPackageJSON = require('./get-package-json')

const packageJSON = getPackageJSON()
const path = './README.md'

function getDocsPath() {
  switch (packageJSON.name) {
    case 'jss':
      return 'setup'
    default:
      return packageJSON.name
  }
}

const contents = `
# ${packageJSON.name}

> ${packageJSON.description}

See our website [${
  packageJSON.name
}](https://cssinjs.org/${getDocsPath()}?v=v10.0.0-alpha.8) for more information.

## Install

Using npm:

\`\`\`sh
npm install ${packageJSON.name}
\`\`\`

or using yarn:

\`\`\`sh
yarn add ${packageJSON.name}
\`\`\`
`

fs.writeFile(path, contents)
