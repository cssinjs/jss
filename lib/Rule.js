'use strict'

var uid = 0

var processors = []

/**
 * Rule is selector + style hash.
 *
 * @param {String} [selector]
 * @param {Object} style is property:value hash.
 * @param {Object} [stylesheet]
 * @api public
 */
function Rule(selector, style, stylesheet) {
    if (typeof selector == 'object') {
        stylesheet = style
        style = selector
        selector = null
    }

    if (selector) {
        this.selector = selector
    } else {
        this.className = Rule.NAMESPACE_PREFIX + '-' + uid
        uid++
        this.selector = '.' + this.className
    }

    this.stylesheet = stylesheet
    this.style = style
}

module.exports = Rule

Rule.NAMESPACE_PREFIX = 'jss'

/**
 * Add a preprocessor.
 *
 * @param {Function} fn
 * @return {Array}
 * @api public
 */
Rule.addPreprocessor = function (fn) {
    processors.push(fn)
    return processors
}

/**
 * Execute all registered preprocessors.
 *
 * @api private
 */
Rule.prototype.runPreprocessors = function () {
    for (var i = 0; i < processors.length; i++) {
        processors[i](this)
    }

    return this
}

var hasKeyframes = /@keyframes/

/**
 * Converts the rule to css string.
 *
 * @return {String}
 * @api public
 */
Rule.prototype.toString = function () {
    var isKeyframe = hasKeyframes.test(this.selector)
    var style = this.style
    var str = this.selector + ' {'

    for (var prop in style) {
        var value = style[prop]
        if (typeof value == 'object') {
            var valueStr = '{'
            for (var prop2 in value) {
                valueStr += '\n    ' + prop2 + ': ' + value[prop2] + ';'
            }
            valueStr += '\n  }'
            value = valueStr
        } else {
            value += ';'
        }
        str += '\n  ' + prop + (isKeyframe ? ' ' : ': ') + value
    }

    str += '\n}'

    return str
}
