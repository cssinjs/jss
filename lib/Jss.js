'use strict'

var StyleSheet = require('./StyleSheet')
var Rule = require('./Rule')
var PluginsRegistry = require('./PluginsRegistry')

/**
 * Jss constructor.
 *
 * @api public
 */
function Jss() {
	this.plugins = new PluginsRegistry()
}

module.exports = Jss

/**
 * Creates a new instance of Jss.
 *
 * @see Jss
 * @api public
 */
Jss.prototype.create = function () {
	return new Jss()
}

/**
 * Create a stylesheet.
 *
 * @see StyleSheet
 * @api public
 */
Jss.prototype.createStyleSheet = function (rules, options) {
    if (!options) options = {}
    options.jss = this
    var sheet = new StyleSheet(rules, options)
    return sheet
}

/**
 * Create a rule.
 *
 * @see Rule
 * @return {Rule}
 * @api public
 */
Jss.prototype.createRule = function (selector, style, options) {
    if (typeof selector == 'object') {
        options = style
        style = selector
        selector = null
    }
    if (!options) options = {}
    options.jss = this
    var rule = new Rule(selector, style, options)
    this.plugins.run(rule)
    return rule
}

/**
 * Register plugin. Passed function will be invoked with a rule instance.
 *
 * @param {Function} fn
 * @api public
 */
Jss.prototype.use = function (fn) {
	this.plugins.use(fn)
	return this
}
