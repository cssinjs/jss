'use strict'

var jss = require('..')

/**
 * Add vendor prefix to a property name when needed.
 *
 * @param {Rule} rule
 * @api private
 */
module.exports = function (rule) {
    var style = rule.style

    for (var prop in style) {
        var supportedProp = jss.support.getProp(prop)
        if (supportedProp) {
            style[supportedProp] = style[prop]
            delete style[prop]
        }
    }
}
