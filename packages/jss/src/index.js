/* @flow */
/**
 * A better abstraction over CSS.
 *
 * @copyright Oleg Slobodskoi 2014-present
 * @website https://github.com/cssinjs/jss
 * @license MIT
 */
import Jss from './Jss'
import type StyleSheet from './StyleSheet'
import type ConditionalRule from './rules/ConditionalRule'
import type KeyframesRule from './rules/KeyframesRule'
import type StyleRule from './rules/StyleRule'
import type ViewportRule from './rules/ViewportRule'
import type SimpleRule from './rules/SimpleRule'
import type FontFaceRule from './rules/FontFaceRule'
import type {JssOptions} from './types'

/**
 * Export types for better typing inside plugins and integrations.
 */
export type {
  StyleSheetFactoryOptions,
  JssValue,
  JssOptions,
  JssStyle,
  Plugin,
  GenerateClassName,
  RuleListOptions,
  Rule,
  Renderer,
  RuleOptions,
  UpdateOptions,
  Classes,
  BaseRule,
  ContainerRule
} from './types'

export type {
  Jss,
  StyleSheet,
  ConditionalRule,
  KeyframesRule,
  StyleRule,
  ViewportRule,
  SimpleRule,
  FontFaceRule
}

/**
 * Extracts a styles object with only rules that contain function values.
 */
export {default as getDynamicStyles} from './utils/getDynamicStyles'

/**
 * Converts JSS array value to a CSS string.
 */
export {default as toCssValue} from './utils/toCssValue'

/**
 * Create a rule instance.
 */
export {default as createRule} from './utils/createRule'

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
