const path = require('path')
const shell = require('shelljs')

function getCommand() {
  const rollup = path.join(__dirname, '../node_modules/.bin/rollup')
  const args = ['--config "../../rollup.config.js"']

  return `${rollup} ${args.join(' ')}`
}

function handleExit(code, errorCallback) {
  if (code !== 0) {
    errorCallback()

    shell.exit(code)
  }
}

function buildUmd(options = {}) {
  const {silent = false, errorCallback} = options
  const command = getCommand()
  const {code} = shell.exec(command, {silent})

  handleExit(code, errorCallback)
}

module.exports = {buildUmd}
