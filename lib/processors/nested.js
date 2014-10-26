'use strict'

var Rule = require('../Rule')

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
            var selector = rule.selector + prop.substr(1)
            stylesheet.rules[selector] = new Rule(selector, style[prop], stylesheet)
            delete style[prop]
        }
    }
}
