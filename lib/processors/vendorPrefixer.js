'use strict'

var jss = require('..')

/**
 * We test every property on vendor prefix requirement.
 * Once tested, result is cached. It gives us up to 70% perf boost.
 * http://jsperf.com/element-style-object-access-vs-plain-object
 */
var cache = {}

var p = document.createElement('p')

/**
 * Add vendor prefix to a property name when needed.
 * It doesn't covers cases where vendor prefix needs to be added to the property
 * value.
 *
 * @param {Rule} rule
 * @api private
 */
module.exports = function (rule) {
    var stylesheet = rule.stylesheet
    var style = rule.style

    for (var prop in style) {
        // We have not tested this prop yet, lets do the test.
        if (cache[prop] == null) {
            var prefixedProp = jss.vendorPrefix + prop
            // Use vendor prefixed version if known, otherwise use original.
            cache[prop] = prefixedProp in p.style ? prefixedProp : false
        }

        if (cache[prop]) {
            style[cache[prop]] = style[prop]
            delete style[prop]
        }
    }
}
