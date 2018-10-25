const chalk = require('chalk')
const getPackageJSON = require('./get-package-json')

const pkg = getPackageJSON()

function log(type, message) {
  const fn = type === 'error' ? console.error : console.log

  fn(`${chalk.bold(`[${pkg.name}]`)} ${message}`)
}

module.exports = log
