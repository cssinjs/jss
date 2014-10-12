'use strict'

var Style = require('./Style')
var Rule = require('./Rule')

var mainStyle = new Style()

/**
 * Create a stylesheet.
 *
 * @param {Object} rules
 * @return {Style}
 * @api public
 */
exports.createStyle = function (rules) {
    return new Style(rules)
}

/**
 * Create a namespaced css rule.
 *
 * @param {Object} style
 * @return
 * @api public
 */
exports.createRule = function (style) {
    var rule = new Rule(style)
    mainStyle.attach().addRule(rule)
    return rule
}
