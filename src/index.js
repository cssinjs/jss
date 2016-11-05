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
import RegularRule from './rules/RegularRule'

// For testing only.
export {
  Jss,
  StyleSheet,
  RegularRule
}

/**
 * Creates a new instance of Jss.
 *
 * @see Jss
 * @api public
 */
export const create = (options?: Object) => new Jss(options)

/**
 * A global Jss instance.
 *
 * @see Jss
 * @api public
 */
export default create()
