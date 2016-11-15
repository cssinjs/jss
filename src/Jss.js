import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import SheetsRegistry from './SheetsRegistry'
import createRule from './createRule'
import findRenderer from './findRenderer'
import {generateClassName} from './utils'

/**
 * Main Jss class.
 *
 * @api public
 */
export default class Jss {
  /**
   * Create a jss instance to allow local setup.
   *
   * @see .setup()
   */
  constructor(options) {
    this.sheets = new SheetsRegistry()
    this.plugins = new PluginsRegistry()
    this.version = __VERSION__
    this.setup(options)
  }

  /**
   * Setup JSS.
   *
   * Options:
   * - `generateClassName` accepts a styles string and a Rule instance.
   * - `plugins`
   *
   * @param {Object} options
   * @return {Jss}
   * @api public
   */
  setup(options = {}) {
    this.generateClassName = options.generateClassName || generateClassName
    if (options.plugins) {
      options.plugins.forEach((plugin) => {
        this.use(plugin)
      })
    }
    return this
  }

  /**
   * Create a style sheet.
   *
   * @see StyleSheet
   * @api public
   */
  createStyleSheet(rules, options) {
    const sheet = new StyleSheet(rules, {...options, jss: this})
    this.sheets.add(sheet)
    return sheet
  }

  /**
   * Detach the style sheet and remove it from the registry.
   *
   * @param {StyleSheet} sheet
   * @api public
   */
  removeStyleSheet(sheet) {
    sheet.detach()
    this.sheets.remove(sheet)
    return this
  }

  /**
   * Create a rule.
   *
   * @see createRule
   * @api public
   */
  createRule(selector, style, options) {
    // Enable rule without selector.
    if (typeof selector == 'object') {
      options = style
      style = selector
      selector = null
    }
    const rule = createRule(selector, style, {
      jss: this,
      Renderer: findRenderer(options),
      ...options
    })
    this.plugins.run(rule)
    return rule
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   *
   * @param {Function} plugins
   * @return {Jss}
   * @api public
   */
  use(...plugins) {
    plugins.forEach(plugin => this.plugins.use(plugin))
    return this
  }
}
