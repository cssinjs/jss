'use strict'

var stringify = JSON.stringify
var parse = JSON.parse

/**
 * Deeply clone object over serialization.
 * Expects object to be without cyclic dependencies.
 *
 * @type {Object} obj
 * @return {Object}
 */
module.exports = function clone(obj) {
    return parse(stringify(obj))
}