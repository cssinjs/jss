'use strict'

var RuleSet = require('./RuleSet')

/**
 * Creates style element, contains rules, injects style into dom.
 *
 * @param {Object} rules object with selectors and declarations
 * @api public
 */
function Style(rules) {
    this.node = null
    this.rules = {}
    for (var selector in rules) {
        this.rules[selector] = new RuleSet(selector, rules[selector])
    }
    this.text = this.toString()
}

module.exports = Style

/**
 * Insert style element to render tree.
 *
 * @api public
 * @return {Style}
 */
Style.prototype.attach = function () {
    this.node || (this.node = this.createStyle())
    this.node.innerHTML = this.text
    document.head.appendChild(this.node)

    return this
}

/**
 * Remove style element from render tree.
 *
 * @return {Style}
 * @api public
 */
Style.prototype.detach = function () {
    this.node.parentNode.removeChild(this.node)

    return this
}

/**
 * Convert rules to a css string.
 *
 * @api public
 * @return {String}
 */
Style.prototype.toString = function () {
    var str = ''
    var rules = this.rules

    for (var selector in rules) {
        str += rules[selector].toString()
    }

    return str
}

/**
 * Create style element.
 *
 * @api private
 * @return {Element}
 */
Style.prototype.createStyle = function () {
    var node = document.createElement('style')
    return node
}
