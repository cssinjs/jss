'use strict'

var prefixes = {
    Webkit: '-webkit-',
    Moz: '-moz-',
    // IE did it wrong again ...
    ms: '-ms-',
    O: '-o-'
}

var style = document.createElement('p').style
var testProp = 'Transform'

for (var jsName in prefixes) {
    if ((jsName + testProp) in style) {
        module.exports = prefixes[jsName]
        break
    }
}
