const fs = require('fs')
const shell = require('shelljs')
const path = require('path')

const lerna = require('../lerna')
const {CHANGELOG_FILENAME} = require('./constants')

const ghRelease = path.resolve(process.cwd(), './node_modules/.bin/gh-release')

function getChangelog() {
  const content = fs.readFileSync(path.join(process.cwd(), CHANGELOG_FILENAME), 'utf-8')

  const lines = content.split('\n')
  let hasStarted = false
  let hasFinished = false

  const body = lines
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

  return `\n${body}`
}

const args = [
  `-n v${lerna.version}`,
  `-t v${lerna.version}`,
  `-b "${getChangelog()}"`,
  `-o HenriBeck`,
  `-r jss`
]

if (lerna.version.contains('alpha')) {
  args.push('-p')
}

const {code} = shell.exec(`${ghRelease} ${args.join(' ')}`)

if (code !== 0) {
  shell.exit(code)
}
