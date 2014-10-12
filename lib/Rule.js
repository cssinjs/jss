'use strict'

var uid = 0

/**
 * Rule is selector + style hash.
 *
 * @param {String} [selector]
 * @param {Object} style
 * @api private
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
        str += prop + ':' + value + ';'
    }
    str += '}'

    return str
}


