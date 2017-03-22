/* @flow */
import type StyleSheet from './StyleSheet'
import type {Plugin, Rule, RuleOptions} from './types'

export default class PluginsRegistry {
  createRuleHooks: Array<Function> = []

  processRuleHooks: Array<Function> = []

  processSheetHooks: Array<Function> = []

  changeValueHooks: Array<Function> = []

  /**
   * Call `onCreateRule` hooks and return an object if returned by a hook.
   */
  onCreateRule(name?: string, decl: Object, options: RuleOptions): Rule|null {
    for (let i = 0; i < this.createRuleHooks.length; i++) {
      const rule = this.createRuleHooks[i](name, decl, options)
      if (rule) return rule
    }
    return null
  }

  /**
   * Call `onProcessRule` hooks.
   */
  onProcessRule(rule: Rule): void {
    if (rule.isProcessed) return
    for (let i = 0; i < this.processRuleHooks.length; i++) {
      this.processRuleHooks[i](rule, rule.options.sheet)
    }
    rule.isProcessed = true
  }

  /**
   * Call `onProcessSheet` hooks.
   */
  onProcessSheet(sheet: StyleSheet): void {
    for (let i = 0; i < this.processSheetHooks.length; i++) {
      this.processSheetHooks[i](sheet)
    }
  }

  /**
   * Call `onChangeValue` hooks.
   */
  onChangeValue(value: string, prop: string, rule: Rule): string {
    let processedValue = value
    for (let i = 0; i < this.changeValueHooks.length; i++) {
      const nextValue = this.changeValueHooks[i](processedValue, prop, rule)
      if (nextValue !== undefined) processedValue = nextValue
    }
    return processedValue
  }

  /**
   * Register a plugin.
   * If function is passed, it is a shortcut for `{onProcessRule}`.
   */
  use(plugin: Plugin|Function): void {
    if (typeof plugin === 'function') {
      this.processRuleHooks.push(plugin)
      return
    }

    if (plugin.onCreateRule) this.createRuleHooks.push(plugin.onCreateRule)
    if (plugin.onProcessRule) this.processRuleHooks.push(plugin.onProcessRule)
    if (plugin.onProcessSheet) this.processSheetHooks.push(plugin.onProcessSheet)
    if (plugin.onChangeValue) this.changeValueHooks.push(plugin.onChangeValue)
  }
}
