const fs = require('fs')
const path = require('path')
const {xSync} = require('tinyexec')

const createReadme = require('./create-readme')

fs.rmSync('./dist/', {recursive: true, force: true})
fs.copyFileSync(path.join(__dirname, '..', 'LICENSE'), './LICENSE')
createReadme()

const rolldown = path.join(__dirname, '../node_modules/.bin/rolldown')
xSync(rolldown, ['--config', '../../rolldown.config.mjs'], {
  throwOnError: true,
  nodePath: false,
  nodeOptions: {stdio: 'inherit'}
})
