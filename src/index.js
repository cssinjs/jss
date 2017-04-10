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
import RulesContainer from './RulesContainer'
import sheets from './sheets'
import type {JssOptions} from './types'
import getDynamicStyles from './utils/getDynamicStyles'

/**
 * Extracts a styles object with only rules that contain function values.
 */
export {getDynamicStyles}

/**
 * SheetsRegistry for SSR.
 */
export {SheetsRegistry}

/**
 * RulesContainer for plugins.
 */
export {RulesContainer}

/**
 * Default global SheetsRegistry instance.
 */
export {sheets}

/**
 * Creates a new instance of Jss.
 */
export const create = (options?: JssOptions): Jss => new Jss(options)

/**
 * A global Jss instance.
 */
export default create()
