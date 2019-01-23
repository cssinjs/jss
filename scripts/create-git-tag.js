const fs = require('fs')
const shell = require('shelljs')

const lerna = require('../lerna')

function getChangelog() {
  const content = fs.readFileSync('../changelog.md', 'utf-8')

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
