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

// For testing only.
export {
  Jss,
  StyleSheet,
  Rule
}

/**
 * Creates a new instance of Jss.
 *
 * @see Jss
 * @api public
 */
export function create(options) {
  return new Jss(options)
}

export default create()
