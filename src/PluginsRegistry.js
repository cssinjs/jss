/* @flow */

export function applyHook(type: string, plugin: Object, a1: any, a2: any): void {
  const hook = plugin[type]
  if (hook) hook(a1, a2)
}

/**
 * Register a plugin, run a plugin.
 *
 * @api public
 */
export default class PluginsRegistry {
  registry: Array<Object> = []

  onRule: Function = this.exec.bind(this, 'onRule')

  /**
   * Register a plugin.
   * If `plugin` is a function, it's an onRule hook.
   *
   * @api public
   */
  use(plugin: Function | Object): void {
    if (typeof plugin === 'function') {
      plugin = {onRule: plugin}
    }

    this.registry.push(plugin)
  }

  exec(type: string, arg: any): void {
    for (let i = 0; i < this.registry.length; i++) {
      applyHook(type, this.registry[i], arg)
    }
  }
}
