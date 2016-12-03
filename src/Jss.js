/* eslint-disable prefer-spread */

import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import internalPlugins from './plugins'
import sheets from './sheets'
import generateClassNameDefault from './utils/generateClassName'
import createRule from './utils/createRule'
import findRenderer from './utils/findRenderer'

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
    this.options = {
      ...options,
      generateClassName: options.generateClassName || generateClassNameDefault
    }
    if (this.options.plugins) this.use.apply(this, this.options.plugins)
    return this
  }

  /**
   * Create a style sheet.
   *
   * @see StyleSheet
   * @api public
   */
  createStyleSheet(styles, options) {
    options = {
      jss: this,
      generateClassName: this.options.generateClassName,
      ...options
    }
    return new StyleSheet(styles, options)
  }

  /**
   * Detach the style sheet and remove it from the registry.
   *
   * @param {StyleSheet} sheet
   * @api public
   */
  removeStyleSheet(sheet) {
    sheet.detach()
    sheets.remove(sheet)
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

    // Perf optimization, turns out to be important.
    const {jss, Renderer, generateClassName} = options || {}
    if (!jss || !Renderer || !generateClassName) {
      options = {
        jss: this,
        Renderer: findRenderer(options),
        generateClassName: generateClassName || this.options.generateClassName,
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
