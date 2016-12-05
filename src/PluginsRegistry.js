/* @flow */
export default class PluginsRegistry {
  registry: Array<Plugin> = []

  /**
   * Call `onCreateRule` hooks and return an object if returned by a hook.
   */
  onCreateRule(name: string, decl: Object, options: RuleOptions): Object | null {
    for (let i = 0; i < this.registry.length; i++) {
      const {onCreateRule} = this.registry[i]
      if (!onCreateRule) continue
      const rule = onCreateRule(name, decl, options)
      if (rule) return rule
    }
    return null
  }

  /**
   * Call `onProcessRule` hooks.
   */
  onProcessRule(rule: Object): void {
    for (let i = 0; i < this.registry.length; i++) {
      const {onProcessRule} = this.registry[i]
      if (onProcessRule) onProcessRule(rule)
    }
  }

  /**
   * Register a plugin.
   * If function is passed, it is a shortcut for `{onProcessRule}`.
   */
  use(plugin: Plugin | Function): void {
    if (typeof plugin === 'function') {
      plugin = {onProcessRule: plugin}
    }

    this.registry.push(plugin)
  }
}

