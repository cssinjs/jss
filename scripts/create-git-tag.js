const fs = require('fs')
const path = require('path')

const lerna = require('../lerna')

fs.readFile(path.resolve(__dirname, '../changelog.md'), 'utf-8', (err, content) => {
  const lines = content.split('\n')
  let hasStarted = false
  let hasFinished = false

  const changes = lines
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

  console.log(changes)
})
