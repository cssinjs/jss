const path = require('path')
const shell = require('shelljs')
const chalk = require('chalk')
const log = require('npmlog')

const {buildLib} = require('./build-lib')
const {createFlowFile} = require('./create-flow-file')
const {buildUmd} = require('./build-umd')
const {buildModules} = require('./build-modules')
const {getPackageJson} = require('./get-package-json')

const pkg = getPackageJson()

function copyLicence() {
  const licence = path.join(__dirname, '..', 'LICENSE')

  shell.cp(licence, './')
}

function logError(type) {
  log.error(`FAILED to ${type}: ${chalk.bold(`${pkg.name}@${pkg.version}`)}`)
}

shell.rm('-rf', './lib/')
shell.rm('-rf', './dist/')
shell.rm('-rf', './esm/')
copyLicence()
buildLib({errorCallback: () => logError('build commonjs')})
buildModules({errorCallback: () => logError('build modules')})
createFlowFile({errorCallback: () => logError('create flow file')})
buildUmd({errorCallback: () => logError('build umd')})

log.info(chalk.gray(`Built: ${chalk.bold(`${pkg.name}@${pkg.version}`)}`))
