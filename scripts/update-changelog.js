const fs = require('fs')
const path = require('path')
const log = require('npmlog/log')

const lerna = require('../lerna')
const {CHANGELOG_FILENAME} = require('./constants')

const changelogPath = path.join(process.cwd(), CHANGELOG_FILENAME)
const content = fs.readFileSync(changelogPath, 'utf-8')

const lines = content
  .split('\n')
  .map((line) => {
    if (line.startsWith('## Next')) {
      const today = new Date()
      const date = `${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`

      return `${line}\n\n## ${lerna.version} (${date})`
    }

    return line
  })
  .join('\n')

fs.writeFile(changelogPath, lines, 'utf-8', (err) => {
  if (err) {
    log.error('jss', 'Error while updating changelog')
    process.exit(1)
  } else {
    log.info('jss', 'Successfully updated changelog')
  }
})
