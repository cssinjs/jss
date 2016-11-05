/* @flow */

/**
 * Register a plugin, run a plugin.
 *
 * @api public
 */
export default class PluginsRegistry {
  registry: Array<Object>
  jss: Object

  constructor(jss: Object): void {
    this.registry = []
    this.jss = jss
  }

  /**
   * Register plugin.
   * If plugin is a function, its an onRule hook.
   * Also we call .onSetup hook here.
   *
   * @api public
   */
  use(plugin: Function | Object): void {
    if (typeof plugin === 'function') {
      plugin = {onRule: plugin}
    }
    this.registry.push(plugin)
    if (plugin.onSetup) plugin.onSetup(this.jss)
  }

  /**
   * Call all .onRule hooks for passed rules.
   *
   * @api public
   */
  handleRules(rules: Array<Object>): void {
    rules.forEach(this.handleRule, this)
  }

  /**
   * Call all .onRule hooks for passed rule.
   *
   * @api public
   */
  handleRule(rule: Object): void {
    for (let index = 0; index < this.registry.length; index++) {
      const plugin = this.registry[index]
      if (plugin.onRule) plugin.onRule(rule)
    }
  }

  /**
   * Call all .onSheet hooks for passed sheet.
   *
   * @api public
   */
  handleSheet(sheet: Object): void {
    for (let index = 0; index < this.registry.length; index++) {
      const plugin = this.registry[index]
      if (plugin.onSheet) plugin.onSheet(sheet)
    }
  }
}
