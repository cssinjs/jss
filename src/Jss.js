import StyleSheet from './StyleSheet'
import PluginsRegistry from './PluginsRegistry'
import * as uid from './uid'
import createRule from './createRule'

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
  createStyleSheet(rules, options = {}) {
    options.jss = this
    return new StyleSheet(rules, options)
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
    if (!options) options = {}
    options.jss = this
    let rule = createRule(selector, style, options)
    this.plugins.run(rule)
    return rule
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   *
   * @param {Function} fn
   * @api public
   */
  use(fn) {
    this.plugins.use(fn)
    return this
  }
}
