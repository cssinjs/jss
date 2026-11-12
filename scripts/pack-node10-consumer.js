// Run after the Node 24 build. Keep the consumer outside the workspace so it
// cannot resolve unpublished sources or development dependencies.
const fs = require('fs')
const os = require('os')
const path = require('path')
const {execFileSync} = require('child_process')

const root = path.resolve(__dirname, '..')
const consumer = fs.mkdtempSync(path.join(os.tmpdir(), 'jss-node10-'))
const dependencies = {react: '16.8.6', 'react-dom': '16.8.6'}

fs.readdirSync(path.join(root, 'packages')).forEach((directory) => {
  const cwd = path.join(root, 'packages', directory)
  const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'))
  const archive = path.join(consumer, `${pkg.name}.tgz`)
  execFileSync('yarn', ['pack', '--filename', archive], {cwd, stdio: 'inherit'})
  dependencies[pkg.name] = `file:${archive}`
})

fs.writeFileSync(
  path.join(consumer, 'package.json'),
  JSON.stringify({name: 'jss-node10-consumer', private: true, dependencies}, null, 2)
)
fs.copyFileSync(path.join(__dirname, 'node10-smoke.js'), path.join(consumer, 'smoke.js'))
// setup-node can switch runtimes before the isolated install and smoke tests.
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `consumer=${consumer}\n`)
}
console.log(`Consumer prepared at ${consumer}`)
