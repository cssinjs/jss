/* @flow */
import type StyleSheet from './StyleSheet'
import type {Plugin, Rule, RuleOptions} from './types'

export default class PluginsRegistry {
  ruleCreators: Array<Function> = []

  ruleProcessors: Array<Function> = []

  sheetProcessors: Array<Function> = []

  /**
   * Call `onCreateRule` hooks and return an object if returned by a hook.
   */
  onCreateRule(name?: string, decl: Object, options: RuleOptions): Rule|null {
    for (let i = 0; i < this.ruleCreators.length; i++) {
      const rule = this.ruleCreators[i](name, decl, options)
      if (rule) return rule
    }
    return null
  }

  /**
   * Call `onProcessRule` hooks.
   */
  onProcessRule(rule: Rule): void {
    if (rule.isProcessed) return
    for (let i = 0; i < this.ruleProcessors.length; i++) {
      this.ruleProcessors[i](rule, rule.options.sheet)
    }
    rule.isProcessed = true
  }

  /**
   * Call `onProcessSheet` hooks.
   */
  onProcessSheet(sheet: StyleSheet): void {
    for (let i = 0; i < this.sheetProcessors.length; i++) {
      this.sheetProcessors[i](sheet)
    }
  }

  /**
   * Register a plugin.
   * If function is passed, it is a shortcut for `{onProcessRule}`.
   */
  use(plugin: Plugin|Function): void {
    if (typeof plugin === 'function') {
      this.ruleProcessors.push(plugin)
      return
    }

    if (plugin.onCreateRule) this.ruleCreators.push(plugin.onCreateRule)
    if (plugin.onProcessRule) this.ruleProcessors.push(plugin.onProcessRule)
    if (plugin.onProcessSheet) this.sheetProcessors.push(plugin.onProcessSheet)
  }
}
