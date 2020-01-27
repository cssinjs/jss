require('babel-register')({
  presets: ['es2015', 'react', 'stage-0']
})
const render = require('../src/server').default

console.log(render())
