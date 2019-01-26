const fs = require('fs')
const shell = require('shelljs')
const Path = require('path')

const lerna = require('../lerna')
const {CHANGELOG_FILENAME} = require('./constants')

function getChangelog() {
  const content = fs.readFileSync(Path.join(process.cwd(), CHANGELOG_FILENAME), 'utf-8')

  const lines = content.split('\n')
  let hasStarted = false
  let hasFinished = false

  return lines
    .filter(line => {
      if (hasFinished) {
        return false
      }

      if (hasStarted) {
        hasFinished = line.startsWith('## ')

        return !hasFinished
      }

      hasStarted = line.startsWith(`## ${lerna.version}`)

      return false
    })
    .join('\n')
}

const changelog = getChangelog()
const {code} = shell.exec(`git tag v${lerna.version} -f -a -m "${changelog}"`)

if (code !== 0) {
  shell.exit(code)
}
