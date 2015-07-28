'use strict'

/**
 * StyleSheets written in javascript.
 *
 * @copyright Oleg Slobodskoi 2015
 * @website https://github.com/jsstyles/jss
 * @license MIT
 */

var StyleSheet = require('./StyleSheet')
var Rule = require('./Rule')
var Jss = require('./Jss')
var uid = require('./uid')

module.exports = exports = new Jss()

exports.StyleSheet = StyleSheet
exports.Rule = Rule
exports.Jss = Jss
exports.uid = uid