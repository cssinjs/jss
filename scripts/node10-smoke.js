// This file is copied into the isolated consumer and run with Node 10 in both modes.
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const {create, SheetsRegistry} = require('jss')
const preset = require('jss-preset-default').default
const React = require('react')
const {renderToString} = require('react-dom/server')
const {createUseStyles, JssProvider} = require('react-jss')

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))
Object.keys(pkg.dependencies).forEach((name) => {
  // Exercise every installed public entry, including packages not used below.
  // eslint-disable-next-line global-require, import/no-dynamic-require
  assert(require(name), `Cannot load ${name}`)
})

const jss = create(preset())
const sheet = jss.createStyleSheet({
  root: {padding: 4, '&:hover': {color: 'red'}}
})
const css = sheet.toString()
assert(css.includes('padding: 4px;'), css)
assert(css.includes(':hover'), css)
assert(css.includes('color: red;'), css)

const useStyles = createUseStyles({root: {marginTop: 7, color: 'blue'}})
const registry = new SheetsRegistry()
function Component() {
  const classes = useStyles()
  return React.createElement('div', {className: classes.root}, 'Node 10 SSR')
}
const html = renderToString(
  React.createElement(JssProvider, {registry, jss}, React.createElement(Component))
)
assert(html.includes('Node 10 SSR'), html)
assert(/class="[^"]+"/.test(html), html)
const serverCss = registry.toString()
assert(serverCss.includes('margin-top: 7px;'), serverCss)
assert(serverCss.includes('color: blue;'), serverCss)
console.log(`Node ${process.version} ${process.env.NODE_ENV}: packaged consumer smoke passed`)
