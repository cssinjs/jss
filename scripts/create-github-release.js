const fs = require('fs')
const path = require('path')
const axios = require('axios')
const log = require('npmlog/log')
const {input} = require('@lerna/prompt')

const lerna = require('../lerna')
const {CHANGELOG_FILENAME} = require('./constants')

function getChangelog() {
  const content = fs.readFileSync(path.join(process.cwd(), CHANGELOG_FILENAME), 'utf-8')
  const lines = content.split('\n')
  let hasStarted = false
  let hasFinished = false

  return lines
    .filter((line) => {
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

input('Github Username:')
  .then((username) =>
    input('Github password:').then((password) => ({
      username,
      password
    }))
  )
  .then((auth) =>
    axios.request({
      method: 'POST',
      url: `/repos/cssinjs/jss/releases`,
      baseURL: `https://api.github.com`,
      data: {
        tag_name: `v${lerna.version}`,
        name: `v${lerna.version}`,
        body: getChangelog(),
        prerelease: lerna.version.includes('alpha')
      },
      auth
    })
  )
  .then(() => {
    log.info('jss', 'Successfully created github release')
  })
  .catch((err) => {
    log.error('jss', `Error while creating github release: ${err.message}`)
  })
