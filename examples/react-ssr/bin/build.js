require('babel-register')({
  presets: ['es2015', 'react', 'stage-0']
})
var ReactDOMServer = require('react-dom/server')
var render = require('../src/server').default
console.log(render())
