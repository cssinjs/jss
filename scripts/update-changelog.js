const fs = require('fs')
const path = require('path')
const lerna = require('../lerna')
const {CHANGELOG_FILENAME} = require('./constants')

const changelogPath = path.join(process.cwd(), CHANGELOG_FILENAME)
const content = fs.readFileSync(changelogPath, 'utf-8')

const lines = content
  .split('\n')
  .map(line => {
    if (line === '## Next') {
      const today = new Date()
      const date = `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`

      return `## ${lerna.version} (${date})`
    }

    return line
  })
  .join('\n')

fs.writeFile(changelogPath, lines, 'utf-8')
