'use strict'

var jss = require('..')

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
    var regexp = /[-\s]+(.)?/g

    function toUpper(match, c) {
        return c ? c.toUpperCase() : ''
    }

    return function(str) {
        return str.replace(regexp, toUpper)
    }
}())

/**
 * Add vendor prefix to a property name when needed.
 * It doesn't covers cases where vendor prefix needs to be added to the property
 * value.
 *
 * @param {Rule} rule
 * @api private
 */
module.exports = function (rule) {
    var style = rule.style

    for (var prop in style) {
        // We have not tested this prop yet, lets do the test.
        if (cache[prop] == null) {
            var camelized = jss.vendorPrefix.js + camelize('-' + prop)
            var dasherized = jss.vendorPrefix.css + prop
            // Test if property is supported.
            // Camelization is required because we can't test using
            // css syntax for e.g. in ff.
            cache[prop] = camelized in p.style ? dasherized : false
        }

        if (cache[prop]) {
            style[cache[prop]] = style[prop]
            delete style[prop]
        }
    }
}
