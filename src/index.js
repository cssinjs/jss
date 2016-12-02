/* @flow */
/**
 * A better abstraction over CSS.
 *
 * @copyright Oleg Slobodskoi 2014-present
 * @website https://github.com/cssinjs/jss
 * @license MIT
 */
import Jss from './Jss'
import SheetsRegistry from './SheetsRegistry'

export {SheetsRegistry}

export const sheets = new SheetsRegistry()

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
