/**
 * Stylesheets written in javascript.
 *
 * @copyright Oleg Slobodskoi 2014
 * @website https://github.com/kof/jss
 * @license MIT
 */

'use strict'

var Stylesheet = require('./Stylesheet')
var Rule = require('./Rule')

// Register default processors.
;[
    require('./processors/px'),
    require('./processors/nested')
].forEach(Rule.addPreprocessor)

exports.Stylesheet = Stylesheet

exports.Rule = Rule

/**
 * Create a stylesheet.
 *
 * @param {Object} rules
 * @param {Object} [attributes] stylesheet element attributes
 * @return {Stylesheet}
 * @api public
 */
exports.createStylesheet = function (rules) {
    return new Stylesheet(rules)
}

/**
 * Create a rule.
 *
 * @param {String} [selector]
 * @param {Object} style
 * @return {Rule}
 * @api public
 */
exports.createRule = function (selector, style) {
    return new Rule(selector, style)
}
