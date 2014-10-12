'use strict'

var Rule = require('./Rule')

/**
 * Contains selector and rules.
 *
 * @param {String} selector
 * @param {Object} rule property/value pairs
 * @api private
 */
function RuleSet(selector, rule) {
    this.selector = selector
    this.rule = new Rule(rule)
}

module.exports = RuleSet

/**
 * Converts to css string selector and rule.
 *
 * @return {String}
 * @api public
 */
RuleSet.prototype.toString = function () {
    return this.selector + this.rule.toString()
}
