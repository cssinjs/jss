'use strict'

var regExp = /&/gi

/**
 * Convert nested rules to separate, remove them from original styles.
 *
 * @param {Rule} rule
 * @api private
 */
module.exports = function (rule) {
    var stylesheet = rule.stylesheet
    var style = rule.style

    for (var prop in style) {
        if (prop[0] == '&') {
            var selector = prop.replace(regExp, rule.selector)
            rule.addChild(selector, style[prop])
            delete style[prop]
        }
    }
}
