/* @flow */
/**
 * A better abstraction over CSS.
 *
 * @copyright Oleg Slobodskoi 2014-present
 * @website https://github.com/cssinjs/jss
 * @license MIT
 */
import Jss from './Jss'
import type {JssOptions} from './types'

/**
 * Extracts a styles object with only rules that contain function values.
 */
export {default as getDynamicStyles} from './utils/getDynamicStyles'

/**
 * Converts JSS array value to a CSS string.
 */
export {default as toCssValue} from './utils/toCssValue'

/**
 * SheetsRegistry for SSR.
 */
export {default as SheetsRegistry} from './SheetsRegistry'

/**
 * SheetsManager for react-jss and co.
 */
export {default as SheetsManager} from './SheetsManager'

/**
 * RuleList for plugins.
 */
export {default as RuleList} from './RuleList'

/**
 * Default global SheetsRegistry instance.
 */
export {default as sheets} from './sheets'

/**
 * Class name generator creator.
 */
export {default as createGenerateClassName} from './utils/createGenerateClassName'

/**
 * Creates a new instance of Jss.
 */
export const create = (options?: JssOptions): Jss => new Jss(options)

/**
 * A global Jss instance.
 */
export default create()
