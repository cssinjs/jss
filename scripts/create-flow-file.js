const fs = require('fs')
const path = require('path')

const fileContent = "// @flow\n\nexport * from '../src';"

function createFlowFile({errorCallback}) {
  const modulePath = path.resolve('./')
  const filePath = path.join(modulePath, './lib/index.js.flow')
  fs.writeFile(filePath, fileContent, 'utf-8', err => {
    if (err) {
      errorCallback()
    }
  })
}

module.exports = {createFlowFile}
