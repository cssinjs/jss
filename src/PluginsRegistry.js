/* @flow */
import type {Plugin, Rule, RuleOptions} from './types'

export default class PluginsRegistry {
  creators: Array<Function> = []

  processors: Array<Function> = []

  /**
   * Call `onCreateRule` hooks and return an object if returned by a hook.
   */
  onCreateRule(name?: string, decl: Object, options: RuleOptions): Rule|null {
    for (let i = 0; i < this.creators.length; i++) {
      const rule = this.creators[i](name, decl, options)
      if (rule) return rule
    }
    return null
  }

  /**
   * Call `onProcessRule` hooks.
   */
  onProcessRule(rule: Rule): void {
    if (rule.isProcessed) return
    for (let i = 0; i < this.processors.length; i++) {
      this.processors[i](rule, rule.options.sheet)
    }
    rule.isProcessed = true
  }

  /**
   * Register a plugin.
   * If function is passed, it is a shortcut for `{onProcessRule}`.
   */
  use(plugin: Plugin|Function): void {
    if (typeof plugin === 'function') {
      this.processors.push(plugin)
      return
    }

    if (plugin.onCreateRule) this.creators.push(plugin.onCreateRule)
    if (plugin.onProcessRule) this.processors.push(plugin.onProcessRule)
  }
}
