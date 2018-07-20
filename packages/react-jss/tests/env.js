function reloadModules() {
  Object.keys(require.cache).forEach(key => delete require.cache[key])
  loadModules()
}

function loadModules() {
  const jssModule = require('jss')
  window.jss = jssModule.default
  window.sheets = jssModule.sheets
  window.createJss = jssModule.create

  const reactJssModule = require('../src')
  window.injectSheet = reactJssModule.default
  window.reactJss = reactJssModule.jss
  window.SheetsRegistry = reactJssModule.SheetsRegistry
  window.ThemeProvider = reactJssModule.ThemeProvider
  window.JssProvider = reactJssModule.JssProvider
  window.createGenerateClassName = reactJssModule.createGenerateClassName
  const ReactDom = require('react-dom')
  window.render = ReactDom.render
  window.unmountComponentAtNode = ReactDom.unmountComponentAtNode
}

function reset() {
  unmountComponentAtNode(node)
  reloadModules()
  node.parentNode.removeChild(node)
}

beforeEach(() => {
  window.node = document.body.appendChild(document.createElement('div'))
})

afterEach(reset)

loadModules()
