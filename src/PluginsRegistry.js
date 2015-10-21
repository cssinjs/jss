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
    for (let i = 0; i < this.registry.length; i++) {
      this.registry[i](rule)
    }
  }
}
