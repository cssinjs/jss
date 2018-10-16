/* @flow */
import warning from 'warning'
import type StyleSheet from './StyleSheet'
import type {Plugin, Rule, RuleOptions, UpdateOptions, JssStyle} from './types'
import SimpleRule from './rules/SimpleRule'
import KeyframesRule from './rules/KeyframesRule'
import ConditionalRule from './rules/ConditionalRule'
import FontFaceRule from './rules/FontFaceRule'
import ViewportRule from './rules/ViewportRule'

const classes = {
  '@charset': SimpleRule,
  '@import': SimpleRule,
  '@namespace': SimpleRule,
  '@keyframes': KeyframesRule,
  '@media': ConditionalRule,
  '@supports': ConditionalRule,
  '@font-face': FontFaceRule,
  '@viewport': ViewportRule,
  '@-ms-viewport': ViewportRule
}

/**
 * Generate plugins which will register all rules.
 */
const plugins = Object.keys(classes).map((key: string) => {
  // https://jsperf.com/indexof-vs-substr-vs-regex-at-the-beginning-3
  const re = new RegExp(`^${key}`)
  const RuleClass = classes[key]
  return (name?: string, decl: JssStyle, options: RuleOptions): Rule | null =>
    name && re.test(name) ? new RuleClass(name, decl, options) : null
})

export default class PluginsRegistry {
  hooks: {[key: string]: Array<Function>} = {
    onCreateRule: [],
    onProcessRule: [],
    onProcessStyle: [],
    onProcessSheet: [],
    onChangeValue: [],
    onUpdate: []
  }

  /**
   * Call `onCreateRule` hooks and return an object if returned by a hook.
   */
  onCreateRule(name?: string, decl: JssStyle, options: RuleOptions): Rule | null {
    for (let i = 0; i < this.hooks.onCreateRule.length; i++) {
      const rule = this.hooks.onCreateRule[i](name, decl, options)
      if (rule) return rule
    }

    for (let i = 0; i < plugins.length; i++) {
      const rule = plugins[i](name, decl, options)
      if (rule) return rule
    }

    return null
  }

  /**
   * Call `onProcessRule` hooks.
   */
  onProcessRule(rule: Rule): void {
    if (rule.isProcessed) return
    const {sheet} = rule.options
    for (let i = 0; i < this.hooks.onProcessRule.length; i++) {
      this.hooks.onProcessRule[i](rule, sheet)
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

    for (let i = 0; i < this.hooks.onProcessStyle.length; i++) {
      nextStyle = this.hooks.onProcessStyle[i](nextStyle, rule, sheet)
      // $FlowFixMe
      rule.style = nextStyle
    }
  }

  /**
   * Call `onProcessSheet` hooks.
   */
  onProcessSheet(sheet: StyleSheet): void {
    for (let i = 0; i < this.hooks.onProcessSheet.length; i++) {
      this.hooks.onProcessSheet[i](sheet)
    }
  }

  /**
   * Call `onUpdate` hooks.
   */
  onUpdate(data: Object | void, rule: Rule, sheet: StyleSheet, options: UpdateOptions): void {
    for (let i = 0; i < this.hooks.onUpdate.length; i++) {
      this.hooks.onUpdate[i](data, rule, sheet, options)
    }
  }

  /**
   * Call `onChangeValue` hooks.
   */
  onChangeValue(value: string, prop: string, rule: Rule): string {
    let processedValue = value
    for (let i = 0; i < this.hooks.onChangeValue.length; i++) {
      processedValue = this.hooks.onChangeValue[i](processedValue, prop, rule)
    }
    return processedValue
  }

  /**
   * Register a plugin.
   * If function is passed, it is a shortcut for `{onProcessRule}`.
   */
  use(plugin: Plugin): void {
    for (const name in plugin) {
      if (this.hooks[name]) this.hooks[name].push(plugin[name])
      else warning(false, '[JSS] Unknown hook "%s".', name)
    }
  }
}
