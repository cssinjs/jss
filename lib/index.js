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
    require('./processors/nested'),
    require('./processors/extend')
].forEach(Rule.addPreprocessor)

exports.Stylesheet = Stylesheet

exports.Rule = Rule

/**
 * Create a stylesheet.
 *
 * @param {Object} rules is selector:style hash.
 * @param {Object} [generateClasses] generate class names instead of using rules property as selector.
 * @param {Object} [attributes] stylesheet element attributes.
 * @return {Stylesheet}
 * @api public
 */
exports.createStylesheet = function (rules, generateClasses, attributes) {
    return new Stylesheet(rules, generateClasses, attributes)
}

/**
 * Create a rule.
 *
 * @param {String} [selector]
 * @param {Object} style is property:value hash.
 * @return {Rule}
 * @api public
 */
exports.createRule = function (selector, style) {
    return new Rule(selector, style)
}
