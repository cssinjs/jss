'use strict'

var globalReference = typeof window === 'undefined' ? global : window
var namespace = '__JSS_UID_PREFIX__'
if (globalReference[namespace] == null) globalReference[namespace] = 0

var prefix = globalReference[namespace]++

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

/**
 * Resets the counter.
 *
 * @api private
 */
exports.reset = function() {
    counter = 0
}
