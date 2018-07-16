const path = require('path')
const shell = require('shelljs')
const chalk = require('chalk')
const log = require('npmlog')

const {build} = require('./build')
const {getPackageJson} = require('./get-package-json')

const pkg = getPackageJson()

function logError(type) {
  log.error(`FAILED to ${type}: ${chalk.bold(`${pkg.name}@${pkg.version}`)}`)
}

shell.rm('-rf', './dist/')
shell.cp(path.join(__dirname, '..', 'LICENSE'), './')
build({errorCallback: () => logError('build')})

log.info(chalk.gray(`Built: ${chalk.bold(`${pkg.name}@${pkg.version}`)}`))
