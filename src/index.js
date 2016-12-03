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
import sheets from './sheets'

/**
 * SheetsRegistry for SSR.
 */
export {SheetsRegistry}

/**
 * Default global SheetsRegistry instance.
 */
export {sheets}

/**
 * Creates a new instance of Jss.
 */
export const create = (options?: Object): Jss => new Jss(options)

/**
 * A global Jss instance.
 */
export default create()
