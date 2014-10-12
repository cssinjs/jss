'use strict'

/**
 * Contains the rule - properti/value pairs.
 *
 * @param {Object} rule
 * @api private
 */
function Rule(rule) {
    this.rule = rule
}

module.exports = Rule

/**
 * Converts the rule to css string.
 *
 * @return {String}
 * @api public
 */
Rule.prototype.toString = function () {
    var str = '{'
    var rule = this.rule

    for (var prop in rule) {
        var value = rule[prop]
        if (typeof value == 'number') value += 'px'
        str += prop + ':' + value + ';'
    }
    str += '}'

    return str
}


