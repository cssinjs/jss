const shell = require('shelljs')
const path = require('path')

const crossEnv = path.join(__dirname, '../node_modules/.bin/cross-env')
const rollup = path.join(__dirname, '../node_modules/.bin/rollup')
const {code} = shell.exec(
  `"${crossEnv}" MATCH_SNAPSHOT=true "${rollup}" --config "../../rollup.config.js"`
)

if (code !== 0) {
  shell.exit(code)
}
