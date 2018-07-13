const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const log = require('npmlog')
const {getPackageJson} = require('./get-package-json')

const pkg = getPackageJson()

function getCommand() {
  const babel = path.join(__dirname, '../node_modules/.bin/babel')
  const args = ['./src --out-dir ./lib', '--extends "../../.babelrc"']

  return `VERSION="${pkg.version}" ${babel} ${args.join(' ')}`
}

function handleExit(code, errorCallback) {
  if (code !== 0) {
    if (errorCallback && typeof errorCallback === 'function') {
      errorCallback()
    }

    shell.exit(code)
  }
}

function buildLib(options = {}) {
  const {silent = true, errorCallback} = options

  if (!fs.existsSync('src')) {
    if (!silent) {
      log.error('No src dir')
    }

    return
  }

  const command = getCommand()
  const {code} = shell.exec(command, {silent})

  handleExit(code, errorCallback)
}

module.exports = {buildLib}