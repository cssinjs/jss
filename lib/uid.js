'use strict'

var global = typeof window === 'undefined' ? global : window
var namespace = '__JSS_UID_PREFIX__'
if (global[namespace] == null) global[namespace] = 0

var prefix = global[namespace]++

var counter = 0

/**
 * Returns a uid.
 * Ensures uniqueness if more than 1 jss version is used.
 *
 * @api private
 * @return {String}
 */
exports.get = function() {
    return prefix + '-' + counter++
}