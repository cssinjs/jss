/* @flow */
import warning from 'warning'
import type StyleSheet from './StyleSheet'
import type {Plugin, Rule, RuleOptions, UpdateOptions, JssStyle} from './types'

type Hooks = Array<Function>
type HooksSet = {
  onCreateRule: Hooks,
  onProcessRule: Hooks,
  onProcessStyle: Hooks,
  onProcessSheet: Hooks,
  onChangeValue: Hooks,
  onUpdate: Hooks
}

const genHooks = (): HooksSet => ({
  onCreateRule: [],
  onProcessRule: [],
  onProcessStyle: [],
  onProcessSheet: [],
  onChangeValue: [],
  onUpdate: []
})

export default class PluginsRegistry {
  queue: Array<HooksSet> = [genHooks(), genHooks()]

  /**
   * Call `onCreateRule` hooks and return an object if returned by a hook.
   */
  onCreateRule(name?: string, decl: JssStyle, options: RuleOptions): Rule | null {
    for (let qi = 0; qi < this.queue.length; qi++) {
      const hooks = this.queue[qi]
      for (let hi = 0; hi < hooks.onCreateRule.length; hi++) {
        const rule = hooks.onCreateRule[hi](name, decl, options)
        if (rule) return rule
      }
    }
    return null
  }

  /**
   * Call `onProcessRule` hooks.
   */
  onProcessRule(rule: Rule): void {
    if (rule.isProcessed) return
    const {sheet} = rule.options
    for (let qi = 0; qi < this.queue.length; qi++) {
      const hooks = this.queue[qi]
      for (let hi = 0; hi < hooks.onProcessRule.length; hi++) {
        hooks.onProcessRule[hi](rule, sheet)
      }
    }

    // $FlowFixMe
    if (rule.style) this.onProcessStyle(rule.style, rule, sheet)

    rule.isProcessed = true
  }

  /**
   * Call `onProcessStyle` hooks.
   */
  onProcessStyle(style: JssStyle, rule: Rule, sheet?: StyleSheet): void {
    let nextStyle = style
    for (let qi = 0; qi < this.queue.length; qi++) {
      const hooks = this.queue[qi]
      for (let hi = 0; hi < hooks.onProcessStyle.length; hi++) {
        nextStyle = hooks.onProcessStyle[hi](nextStyle, rule, sheet)
        // $FlowFixMe
        rule.style = nextStyle
      }
    }
  }

  /**
   * Call `onProcessSheet` hooks.
   */
  onProcessSheet(sheet: StyleSheet): void {
    for (let qi = 0; qi < this.queue.length; qi++) {
      const hooks = this.queue[qi]
      for (let hi = 0; hi < hooks.onProcessSheet.length; hi++) {
        hooks.onProcessSheet[hi](sheet)
      }
    }
  }

  /**
   * Call `onUpdate` hooks.
   */
  onUpdate(data: Object | void, rule: Rule, sheet: StyleSheet, options: UpdateOptions): void {
    for (let qi = 0; qi < this.queue.length; qi++) {
      const hooks = this.queue[qi]
      for (let hi = 0; hi < hooks.onUpdate.length; hi++) {
        hooks.onUpdate[hi](data, rule, sheet, options)
      }
    }
  }

  /**
   * Call `onChangeValue` hooks.
   */
  onChangeValue(value: string, prop: string, rule: Rule): string {
    let processedValue = value

    for (let qi = 0; qi < this.queue.length; qi++) {
      const hooks = this.queue[qi]
      for (let hi = 0; hi < hooks.onChangeValue.length; hi++) {
        processedValue = hooks.onChangeValue[hi](processedValue, prop, rule)
      }
    }

    return processedValue
  }

  /**
   * Register a plugin.
   */
  use(plugin: Plugin): void {
    const hooks = this.queue[plugin.queue || 0]
    for (const name in plugin) {
      if (name in hooks) {
        hooks[name].push(plugin[name])
      } else if (name !== 'queue') {
        warning(false, '[JSS] Unknown hook "%s".', name)
      }
    }
  }
}
