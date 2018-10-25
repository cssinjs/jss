const path = require('path')
const shell = require('shelljs')
const log = require('./log')

shell.rm('-rf', './dist/')
shell.cp(path.join(__dirname, '..', 'LICENSE'), './')

const rollup = path.join(__dirname, '../node_modules/.bin/rollup')
const {code} = shell.exec(`${rollup} --config "../../rollup.config.js"`)

if (code !== 0) {
  log('error', 'Build failed')

  shell.exit(code)
}

log('success', 'Build succeeded')
