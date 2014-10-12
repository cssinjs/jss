var jss = require('../..')
var style = require('./style')

jss.createStyle(style.rules).attach()

var button = document.getElementsByTagName('button')[0]
var div = document.getElementsByTagName('div')[0]

button.addEventListener('click', function () {
    div.style.width = style.square.width + 50 + 'px'
    div.style.height = style.square.height + 50 + 'px'
})

