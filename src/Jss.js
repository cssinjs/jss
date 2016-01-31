import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import {uid} from './utils'
import createRule from './createRule'
import findRenderer from './findRenderer'

/**
 * Main Jss class.
 *
 * @api public
 */
export default class Jss {
  constructor() {
    this.plugins = new PluginsRegistry()
    this.uid = uid
  }

  /**
   * Creates a new instance of Jss.
   *
   * @see Jss
   * @api public
   */
  create() {
    return new Jss()
  }

  /**
   * Create a stylesheet.
   *
   * @see StyleSheet
   * @api public
   */
  createStyleSheet(rules, options) {
    return new StyleSheet(rules, {...options, jss: this})
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
      ...options,
      jss: this,
      Renderer: findRenderer(options)
    })
    this.plugins.run(rule)
    return rule
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   *
   * @param {Function} plugins
   * @api public
   */
  use(...plugins) {
    plugins.forEach(plugin => this.plugins.use(plugin))
    return this
  }
}
