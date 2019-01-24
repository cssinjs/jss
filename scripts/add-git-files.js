const shell = require('shelljs')

const {README_FILENAME, CHANGELOG_FILENAME} = require('./constants')

function addFiles(files) {
  const {code} = shell.exec(`git add ${files}`)

  if (code !== 0) {
    shell.exit(code)
  }
}

addFiles('packages/*/.size-snapshot.json')
addFiles(`packages/*/${README_FILENAME}`)
addFiles(CHANGELOG_FILENAME)
