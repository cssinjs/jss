const fs = require('fs')
const Path = require('path')
const lerna = require('../lerna')
const {CHANGELOG_FILENAME} = require('./constants')

const changelogPath = Path.join(process.cwd(), CHANGELOG_FILENAME)
const content = fs.readFileSync(changelogPath, 'utf-8')

const lines = content
  .split('\n')
  .map(line => {
    if (line.startsWith(`## ${lerna.version} (unreleased)`)) {
      const today = new Date()
      return line.replace(
        'unreleased',
        `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`
      )
    }

    return line
  })
  .join('\n')

fs.writeFile(changelogPath, lines, 'utf-8')
