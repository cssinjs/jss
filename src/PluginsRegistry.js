/**
 * Register a plugin, run a plugin.
 */
export default class PluginsRegistry {
  constructor() {
    this.registry = []
  }

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   *
   * @param {Function} fn
   * @api public
   */
  use(fn) {
    this.registry.push(fn)
  }

  /**
   * Execute all registered plugins.
   *
   * @param {Rule} rule
   * @api private
   */
  run(rule) {
    this.registry.forEach(plugin => {
      plugin(rule)
    })
  }
}
