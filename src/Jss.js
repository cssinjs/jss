/* eslint-disable prefer-spread */

import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import {generateClassName} from './utils'
import internalPlugins from './plugins'
import createRule from './createRule'
import findRenderer from './findRenderer'

/**
 * Main Jss class.
 *
 * @api public
 */
export default class Jss {
  version = __VERSION__
  plugins = new PluginsRegistry()

  /**
   * Create a jss instance to allow local setup.
   *
   * @see .setup()
   */
  constructor(options) {
    this.use.apply(this, internalPlugins)
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
    if (options.plugins) this.use.apply(this, options.plugins)
    return this
  }

  /**
   * Create a style sheet.
   *
   * @see StyleSheet
   * @api public
   */
  createStyleSheet(styles, options) {
    return new StyleSheet(styles, {...options, jss: this})
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
  createRule(name, style, options) {
    // Enable rule without name for inline styles.
    if (typeof name === 'object') {
      options = style
      style = name
      name = null
    }

    // Perf optimizion, turns out to be important.
    if (!options || !options.jss || !options.Renderer) {
      options = {
        jss: this,
        Renderer: findRenderer(options),
        ...options
      }
    }

    const rule = createRule(name, style, options)
    this.plugins.onProcess(rule)

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
