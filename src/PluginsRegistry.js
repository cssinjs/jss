/* @flow */

/**
 * Register a plugin, run a plugin.
 *
 * @api public
 */
export default class PluginsRegistry {
  registry: Array<Object> = []

  onCreateRule(name: string, decl: Object, options: Object): Object | null {
    for (let i = 0; i < this.registry.length; i++) {
      const {onCreateRule} = this.registry[i]
      if (!onCreateRule) continue
      const rule = onCreateRule(name, decl, options)
      if (rule) return rule
    }
    return null
  }

  onProcessRule(rule: any): void {
    for (let i = 0; i < this.registry.length; i++) {
      const {onProcessRule} = this.registry[i]
      if (onProcessRule) onProcessRule(rule)
    }
  }

  /**
   * Register a plugin.
   * If `plugin` is a function, it's an onProcessRule hook.
   *
   * @api public
   */
  use(plugin: Function | Object): void {
    if (typeof plugin === 'function') {
      plugin = {onProcessRule: plugin}
    }

    this.registry.push(plugin)
  }
}

