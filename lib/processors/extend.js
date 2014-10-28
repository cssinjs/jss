'use strict'

/**
 * Handle `extend` property.
 *
 * @param {Rule} rule
 * @api private
 */
module.exports = function (rule) {
    var style = rule.style

    if (!style) return

    var extend = style.extend

    if (!extend) return

    var newStyle = {}
    var prop

    // Copy extend style.
    if ('length' in extend) {
        for (var i = 0; i < extend.length; i++) {
            for (prop in extend[i]) newStyle[prop] = extend[i][prop]
        }
    } else {
        for (prop in extend) newStyle[prop] = extend[prop]
    }


    // Copy original style.
    for (prop in style) {
        if (prop != 'extend') newStyle[prop] = style[prop]
    }

    rule.style = newStyle
}
