const fs = require('fs')

const lerna = require('../lerna')
const {CHANGELOG_FILENAME} = require('./constants')

const content = fs.readFileSync(`../${CHANGELOG_FILENAME}`, 'utf-8')

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

fs.writeFile(`../${CHANGELOG_FILENAME}`, lines, 'utf-8')
