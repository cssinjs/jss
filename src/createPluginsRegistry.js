/**
 * Plugins registry.
 */
export default function createPluginsRegistry() {
  const registry = []

  /**
   * Register plugin. Passed function will be invoked with a rule instance.
   *
   * @param {Function} fn
   */
  function use(fn) {
    registry.push(fn)
  }

  /**
   * Execute all registered plugins.
   *
   * @param {Rule} rule
   */
  function run(rule) {
    for (let index = 0; index < registry.length; index++) {
      registry[index](rule)
    }
  }

  return {registry, use, run}
}
