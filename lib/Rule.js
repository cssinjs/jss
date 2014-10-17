'use strict'

var uid = 0

/**
 * Rule is selector + style hash.
 *
 * @param {String} [selector]
 * @param {Object} style
 * @api public
 */
function Rule(selector, style) {
    if (typeof selector == 'object') {
        style = selector
        selector = null
        this.className = Rule.NAMESPACE_PREFIX + '-' + uid
        uid++
    }

    this.selector = selector || ('.' + this.className)
    this.style = style
    this.text = this.toString()
}

module.exports = Rule

Rule.NAMESPACE_PREFIX = 'jss'

/**
 * Extract scoped rules from the current rule.
 *
 * @return {Array}
 * @api private
 */
Rule.prototype.extractScopedRules = function () {
    var rules = []
    var style = this.style

    for (var prop in style) {
        if (prop[0] == '&') {
            var newProp = prop.substr(1)
            rules.push(new Rule(this.selector + newProp, style[prop]))
            delete style[prop]
        }
    }

    return rules
}

/**
 * Converts the rule to css string.
 *
 * @return {String}
 * @api public
 */
Rule.prototype.toString = function () {
    var str = this.selector + '{'
    var style = this.style

    for (var prop in style) {
        var value = style[prop]
        if (typeof value == 'number') value += 'px'
        if (prop[0] != ' ') str += prop + ':' + value + ';'
    }

    str += '}'

    return str
}
