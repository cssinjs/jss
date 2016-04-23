/**
 * StyleSheets written in javascript.
 *
 * @copyright Oleg Slobodskoi 2014-2016
 * @website https://github.com/jsstyles/jss
 * @license MIT
 */
import Jss from './Jss'
import StyleSheet from './StyleSheet'
import Rule from './rules/Rule'

const jss = new Jss()

// Hotfix for babel 5 migration, will be removed in version 4.0.0
module.exports = exports = jss

// For testing only.
export {
  Jss,
  StyleSheet,
  Rule
}

export default jss
