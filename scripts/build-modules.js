const path = require('path')
const shell = require('shelljs')
const {getPackageJson} = require('./get-package-json')

const pkg = getPackageJson()

function getCommand() {
  const babel = path.join(__dirname, '../node_modules/.bin/babel')
  const args = ['./src --out-dir ./esm', '--config-file "../../babel.config.js"']

  return `MODULES="false" VERSION="${pkg.version}" ${babel} ${args.join(' ')}`
}

function handleExit(code, errorCallback) {
  if (code !== 0) {
    errorCallback()

    shell.exit(code)
  }
}

function buildModules(options = {}) {
  const {silent = true, errorCallback} = options
  const command = getCommand()
  const {code} = shell.exec(command, {silent})

  handleExit(code, errorCallback)
}

module.exports = {buildModules}
