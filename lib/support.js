'use strict'

var vendorPrefix = require('./vendorPrefix')

/**
 * We test every property on vendor prefix requirement.
 * Once tested, result is cached. It gives us up to 70% perf boost.
 * http://jsperf.com/element-style-object-access-vs-plain-object
 */
var cache = {}

var p = document.createElement('p')

// Prefill cache with known css properties to reduce amount of
// properties we need to feature test.
// http://davidwalsh.name/vendor-prefix
;(function() {
    var computed = window.getComputedStyle(document.documentElement, '')
    for (var key in computed) {
        cache[computed[key]] = false
    }
}())

// Convert dash separated strings to camel cased.
var camelize = (function () {
    var regExp = /[-\s]+(.)?/g

    function toUpper(match, c) {
        return c ? c.toUpperCase() : ''
    }

    return function(str) {
        return str.replace(regExp, toUpper)
    }
}())

/**
 * Test if a property is supported, returns property with vendor
 * prefix if required, otherwise `false`.
 *
 * @param {String} prop
 * @return {String|Boolean}
 * @api private
 */
exports.getProp = function (prop) {
    // We have not tested this prop yet, lets do the test.
    if (cache[prop] == null) {
        var camelized = vendorPrefix.js + camelize('-' + prop)
        var dasherized = vendorPrefix.css + prop
        // Test if property is supported.
        // Camelization is required because we can't test using
        // css syntax e.g. in ff.
        cache[prop] = camelized in p.style ? dasherized : false
    }

    return cache[prop]
}
