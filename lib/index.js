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
    require('./processors/extend'),
    require('./processors/vendorPrefixer')
].forEach(Rule.addPreprocessor)

exports.Stylesheet = Stylesheet

exports.Rule = Rule

exports.vendorPrefix = require('./vendorPrefix')

/**
 * Create a stylesheet.
 *
 * @param {Object} rules is selector:style hash.
 * @param {Object} [named] rules have names if true, class names will be generated.
 * @param {Object} [attributes] stylesheet element attributes.
 * @return {Stylesheet}
 * @api public
 */
exports.createStylesheet = function (rules, named, attributes) {
    return new Stylesheet(rules, named, attributes)
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
