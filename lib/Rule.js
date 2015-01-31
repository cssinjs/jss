'use strict'

var uid = 0

var toString = Object.prototype.toString

/**
 * Rule is selector + style hash.
 *
 * @param {String} [selector]
 * @param {Object} [style] is property:value hash.
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
    this.style = style || {}
    // Will be set by StyleSheet#link if link option is true.
    this.CSSRule = null
}

module.exports = Rule

Rule.NAMESPACE_PREFIX = 'jss'

/**
 * Get or set a style property.
 *
 * @param {String} name
 * @param {String|Number} [value]
 * @return {Rule|String|Number}
 * @api public
 */
Rule.prototype.prop = function (name, value) {
    // Its a setter.
    if (value) {
        this.style[name] = value
        // If linked option in StyleSheet is not passed, CSSRule is not defined.
        if (this.CSSRule) this.CSSRule.style[name] = value
        return this
    }

    // Its a getter.
    value = this.style[name]

    // Read the value from the DOM if its not cached.
    if (value == null && this.CSSRule) {
        value = this.CSSRule.style[name]
        // Cache the value after we have got it from the DOM once.
        this.style[name] = value
    }

    return value
}

/**
 * Add child rule. Required for plugins like "nested".
 * StyleSheet will render them as a separate rule.
 *
 * @param {String} selector
 * @param {Object} style
 * @return {Rule}
 * @api public
 */
Rule.prototype.addChild = function (selector, style) {
    if (!this.children) this.children = {}
    this.children[selector] = style

    return this
}

/**
 * Apply rule to an element inline.
 *
 * @param {Element} element
 * @return {Rule}
 * @api public
 */
Rule.prototype.applyTo = function (element) {
    for (var prop in this.style) {
        var value = this.style[prop]
        if (toString.call(value) == '[object Array]') {
            for (var i = 0; i < value.length; i++) {
                element.style[prop] = value[i]
            }
        } else {
            element.style[prop] = value
        }
    }

    return this
}

/**
 * Converts the rule to css string.
 *
 * @return {String}
 * @api public
 */
Rule.prototype.toString = function () {
    var isAtRule = this.selector[0] == '@'
    var style = this.style
    var str = this.selector + ' {'

    for (var prop in style) {
        var value = style[prop]
        if (typeof value == 'object') {
            var type = toString.call(value)
            // We are in an at-rule with nested statements.
            // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
            if (type == '[object Object]') {
                var valueStr = '{'
                for (var prop2 in value) {
                    valueStr += '\n    ' + prop2 + ': ' + value[prop2] + ';'
                }
                valueStr += '\n  }'
                value = valueStr
                str += '\n  ' + prop + (isAtRule ? ' ' : ': ') + value
            // We want to generate multiple declarations with identical property names.
            } else if (type == '[object Array]') {
                for (var i = 0; i < value.length; i++) {
                    str += '\n  ' + prop + ': ' + value[i] + ';'
                }
            }
        } else {
            str += '\n  ' + prop + ': ' + value + ';'
        }
    }

    str += '\n}'

    return str
}
