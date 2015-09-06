'use strict'

var uid = require('./uid')
var clone = require('./clone')
var defaults = require('./defaults')

var toString = Object.prototype.toString

/**
 * Rule is selector + style hash.
 *
 * @param {String} [selector] can be selector, rule name, @media etc.
 * @param {Object} [style] declarations block
 * @param {Object} [options]
 * @api public
 */
function Rule(selector, style, options) {
    this.id = uid.get()
    this.options = options || {}
    if (this.options.named == null) this.options.named = true
    this.isAtRule = (selector || '')[0] == '@'

    if (this.options.named) {
        if (this.isAtRule) {
            this.selector = selector
        } else {
            this.className = Rule.NAMESPACE_PREFIX + '-' + this.id
            this.selector = '.' + this.className
        }
    } else {
        this.selector = selector
    }

    // We expect style to be plain object.
    if (style) this.style = clone(style)

    // Will be set by StyleSheet#link if link option is true.
    this.CSSRule = null
    // When at-rule has sub rules.
    this.subrules = null
    this.jss = this.options.jss
    this.extractSubrules()
}

module.exports = Rule

/**
 * Class name prefix when generated.
 *
 * @type {String}
 * @api private
 */
Rule.NAMESPACE_PREFIX = 'jss'

/**
 * Indentation string for formatting toString output.
 *
 * @type {String}
 * @api private
 */
Rule.INDENTATION = '  '

/**
 * Get or set a style property.
 *
 * @param {String} name
 * @param {String|Number} [value]
 * @return {Rule|String|Number}
 * @api public
 */
Rule.prototype.prop = function (name, value) {
    // Its a setter.
    if (value != null) {
        if (!this.style) this.style = {}
        this.style[name] = value
        // If linked option in StyleSheet is not passed, CSSRule is not defined.
        if (this.CSSRule) this.CSSRule.style[name] = value
        return this
    }

    // Its a getter.
    if (this.style) value = this.style[name]

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
 * @param {Object} [options] rule options
 * @return {Rule}
 * @api private
 */
Rule.prototype.addChild = function (selector, style, options) {
    if (!this.children) this.children = {}
    this.children[selector] = {
        style: style,
        options: options
    }

    return this
}

/**
 * Extract @ rules into separate rules.
 *
 * @return {Rule}
 * @api private
 */
Rule.prototype.extractSubrules = function () {
    if (!this.isAtRule || !this.style) return
    if (!this.subrules) this.subrules = {}
    var sheet = this.options.sheet
    for (var name in this.style) {
        var options = this.options
        var style = this.style[name]
        // Not a nested rule.
        if (typeof style == 'string') break
        var selector
        // We are going to overwrite some rule within the same sheet when
        // @media query matches conditions.
        if (options.named) {
            var prevRule = sheet && sheet.rules[name]
            if (prevRule) {
                selector = prevRule.selector
                options = defaults({named: false}, options)
            }
        } else selector = name
        this.subrules[name] = this.jss.createRule(selector, style, options)
        delete this.style[name]
    }
}

/**
 * Apply rule to an element inline.
 *
 * @param {Element} element
 * @return {Rule}
 * @api public
 */
Rule.prototype.applyTo = function (element) {
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
Rule.prototype.toString = function (options) {
    var style = this.style

    // At rules like @charset
    if (this.isAtRule && !this.style && !this.subrules) return this.selector + ';'

    if (!options) options = {}
    if (options.indentationLevel == null) options.indentationLevel = 0

    var str = indent(options.indentationLevel, this.selector + ' {')

    for (var prop in style) {
        var value = style[prop]
        // We want to generate multiple style with identical property names.
        if (toString.call(value) == '[object Array]') {
            for (var i = 0; i < value.length; i++) {
                str += '\n' + indent(options.indentationLevel + 1, prop + ': ' + value[i] + ';')
            }
        } else {
            str += '\n' + indent(options.indentationLevel + 1, prop + ': ' + value + ';')
        }
    }

    // We have an at-rule with nested statements.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule
    var toStringOptions = {indentationLevel: options.indentationLevel + 1}
    for (var name in this.subrules) {
        str += '\n' + indent(
            options.indentationLevel,
            this.subrules[name].toString(toStringOptions)
        )
    }

    str += '\n' + indent(options.indentationLevel, '}')

    return str
}

/**
 * Returns JSON representation of the rule.
 * Nested rules, at-rules and array values are not supported.
 *
 * @return {Object}
 * @api public
 */
Rule.prototype.toJSON = function () {
    var style = {}

    for (var prop in this.style) {
        var value = this.style[prop]
        var type = typeof value
        if (type == 'string' || type == 'number') {
            style[prop] = value
        }
    }

    return style
}

/**
 * Indent a string.
 *
 * http://jsperf.com/array-join-vs-for
 *
 * @param {Number} level
 * @param {String} str
 * @return {String}
 */
function indent(level, str) {
    var indentStr = ''
    for (var i = 0; i < level; i++) indentStr += Rule.INDENTATION
    return indentStr + str
}
