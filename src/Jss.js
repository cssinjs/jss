import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import SheetsRegistry from './SheetsRegistry'
import RulesFactory from './RulesFactory'
import findRenderer from './findRenderer'
import {generateClassName} from './utils'

/**
 * Main Jss class.
 *
 * @api public
 */
export default class Jss {
  version = __VERSION__
  sheets = new SheetsRegistry()
  plugins = new PluginsRegistry(this)
  factory = new RulesFactory()

  /**
   * Create a jss instance to allow local setup.
   *
   * @see .setup()
   */
  constructor(options) {
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
  createStyleSheet(styles, options) {
    const sheet = new StyleSheet(styles, {...options, jss: this})
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
  createRule(name, style, options) {
    // Enable rule without name for inline styles.
    if (typeof name === 'object') {
      options = style
      style = name
      name = null
    }

    options = {
      jss: this,
      Renderer: findRenderer(options),
      ...options
    }

    const rule = this.factory.get(name, style, options)

    if (options.applyPlugins !== false) {
      this.plugins.handleRule(rule)
    }

    return rule
  }

  registerRuleClass(name, cls) {
    this.factory.register(name, cls)
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
