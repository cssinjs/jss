!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.jss=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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



},{}],2:[function(require,module,exports){
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

},{"./Rule":1}],3:[function(require,module,exports){
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

},{"./RuleSet":2}],4:[function(require,module,exports){
'use strict'

var Style = require('./Style')

exports.createStyle = function (def) {
    return new Style(def)
}

},{"./Style":3}]},{},[4])(4)
});