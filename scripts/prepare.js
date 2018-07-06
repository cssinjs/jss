/* eslint-disable no-console */
const path = require('path')
const shell = require('shelljs')
const chalk = require('chalk')
const log = require('npmlog')

const {buildLib} = require('./build-lib')
const {createFlowFile} = require('./create-flow-file')
const {buildUmd} = require('./build-umd')
const getPackageJson = require('./get-package-json')

const packageJson = getPackageJson()

function removeLib() {
  shell.rm('-rf', 'lib/')
}

function removeDist() {
  shell.rm('-rf', 'dist/')
}

function copyLicence() {
  const licence = path.join(__dirname, '..', 'LICENSE')

  shell.cp(licence, './')
}

function logError(type) {
  log.error(`FAILED to ${type}: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`)
}

removeLib()
removeDist()
buildLib({errorCallback: () => logError('build commonjs')})
createFlowFile({errorCallback: () => logError('create flow file')})
buildUmd({errorCallback: () => logError('build umd')})
copyLicence()

console.log(chalk.gray(`Built: ${chalk.bold(`${packageJson.name}@${packageJson.version}`)}`))
