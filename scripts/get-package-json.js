const path = require('path')

function getPackageJson() {
  const modulePath = path.resolve('./')

  // eslint-disable-next-line global-require,import/no-dynamic-require
  return require(path.join(modulePath, 'package.json'))
}

module.exports = getPackageJson
