/* @flow */
/**
 * A better abstraction over CSS.
 *
 * @copyright Oleg Slobodskoi 2014-present
 * @website https://github.com/cssinjs/jss
 * @license MIT
 */
import Jss from './Jss'
import StyleSheet from './StyleSheet'
import SheetsRegistry from './SheetsRegistry'
import Rule from './rules/Rule'

// For testing only.
export {
  Jss,
  StyleSheet,
  SheetsRegistry,
  Rule
}

/**
 * Creates a new instance of Jss.
 *
 * @see Jss
 * @api public
 */
export function create(options?: Object): Jss {
  return new Jss(options)
}

export default create()
