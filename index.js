/**
 * StyleSheets written in javascript.
 *
 * @copyright Oleg Slobodskoi 2014
 * @website https://github.com/jsstyles/jss
 * @license MIT
 */
 
var lib = require('./lib/index')
var root

if (typeof window == 'object' && this === window) {
    root = window
}
else if (typeof global == 'object' && this === global) {
    root = global
}
else {
    root = this
}

if (root != null) {
  root.jss = lib
}

module.exports = lib
