'use strict'

/**
 * Add px to all numeric values.
 *
 * @param {Rule} rule
 * @api private
 */
module.exports = function (rule) {
    var style = rule.style

    for (var prop in style) {
        var value = style[prop]
        if (typeof value == 'number') style[prop] = value + 'px'
    }
}
