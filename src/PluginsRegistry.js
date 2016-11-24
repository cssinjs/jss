/* @flow */

/**
 * Register a plugin, run a plugin.
 *
 * @api public
 */
export default class PluginsRegistry {
  registry: Array<Object> = []

  onCreate(name: string, decl: Object, options: Object): Object | null {
    for (let i = 0; i < this.registry.length; i++) {
      const {onCreate} = this.registry[i]
      if (!onCreate) continue
      const rule = onCreate(name, decl, options)
      if (rule) return rule
    }
    return null
  }

  onProcess(rule: any): void {
    for (let i = 0; i < this.registry.length; i++) {
      const {onProcess} = this.registry[i]
      if (onProcess) onProcess(rule)
    }
  }

  /**
   * Register a plugin.
   * If `plugin` is a function, it's an onProcess hook.
   *
   * @api public
   */
  use(plugin: Function | Object): void {
    if (typeof plugin === 'function') {
      plugin = {onProcess: plugin}
    }

    this.registry.push(plugin)
  }
}

