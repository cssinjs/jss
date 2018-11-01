const path = require('path')
const shell = require('shelljs')

shell.rm('-rf', './dist/')
shell.cp(path.join(__dirname, '..', 'LICENSE'), './')

const rollup = path.join(__dirname, '../node_modules/.bin/rollup')
const {code} = shell.exec(`${rollup} --config "../../rollup.config.js"`)

if (code !== 0) {
  shell.exit(code)
}
