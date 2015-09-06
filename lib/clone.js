'use strict'

var stringify = JSON.stringify
var parse = JSON.parse

/**
 * Deeply clone object using serialization.
 * Expects object to be plain and without cyclic dependencies.
 *
 * http://jsperf.com/lodash-deepclone-vs-jquery-extend-deep/6
 *
 * @type {Object} obj
 * @return {Object}
 */
module.exports = function clone(obj) {
    return parse(stringify(obj))
}