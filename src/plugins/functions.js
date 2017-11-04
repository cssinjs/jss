/* @flow */
import RuleList from '../RuleList'
import StyleRule from '../rules/StyleRule'
import type {Rule, JssStyle, RuleOptions} from '../types'
import kebabCase from '../utils/kebabCase'
import createRule from '../utils/createRule'

let now = Date.now()
const fnValuesNs = `fnValues${now}`
const fnStyleNs = `fnStyle${++now}`

export default {
  onCreateRule(name: string, decl: JssStyle, options: RuleOptions): Rule|null {
    if (typeof decl !== 'function') return null
    const rule = ((createRule(name, {}, options): any): StyleRule)
    // $FlowFixMe
    rule[fnStyleNs] = decl
    return rule
  },

  onProcessStyle(style: JssStyle, rule: Rule): JssStyle {
    const fn = {}
    for (const prop in style) {
      const value = style[prop]
      if (typeof value !== 'function') continue
      delete style[prop]
      fn[kebabCase(prop)] = value
    }
    // $FlowFixMe
    rule[fnValuesNs] = fn
    return style
  },

  onUpdate(data: Object, rule: Rule) {
    // It is a rules container like for e.g. ConditionalRule.
    if (rule.rules instanceof RuleList) {
      rule.rules.update(data)
      return
    }
    if (!(rule instanceof StyleRule)) return

    // $FlowFixMe
    for (const prop in rule[fnValuesNs]) {
      rule.prop(prop, rule[fnValuesNs][prop](data))
    }

    // $FlowFixMe
    const fnStyle = rule[fnStyleNs]

    if (fnStyle) {
      const style = fnStyle(data)
      for (const prop in style) {
        rule.prop(prop, style[prop])
      }
    }
  }
}
