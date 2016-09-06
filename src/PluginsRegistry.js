/**
 * Register a plugin, run a plugin.
 *
 * @api public
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
   * Execute all registered plugins on all rules.
   *
   * @param {Rule|Array} rules
   * @api public
   */
  run(rules) {
    if (Array.isArray(rules)) {
      rules.forEach(this.runOne, this)
      return
    }

    this.runOne(rules)
  }

  /**
   * Execute all registered plugins on one rule.
   *
   * @param {Rule} rule
   * @api private
   */
  runOne(rule) {
    for (let index = 0; index < this.registry.length; index++) {
      this.registry[index](rule)
    }
  }
}
