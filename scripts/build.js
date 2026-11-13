const path = require('path')
const shell = require('shelljs')

const createReadme = require('./create-readme')

shell.rm('-rf', './dist/')
shell.cp(path.join(__dirname, '..', 'LICENSE'), './')
createReadme()

const rolldown = path.join(__dirname, '../node_modules/.bin/rolldown')
const {code} = shell.exec(`"${rolldown}" --config "../../rolldown.config.mjs"`)

if (code !== 0) {
  shell.exit(code)
}
