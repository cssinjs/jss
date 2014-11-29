/**
 * This file exists to manually verify that we can create and stringify
 * style sheet in node.
 */
var jss = require('..')
var ss = jss.createStyleSheet({a: {float: 'left'}})
console.log(ss.toString())
