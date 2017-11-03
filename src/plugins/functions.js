/* @flow */
import RuleList from '../RuleList'
import StyleRule from '../rules/StyleRule'
import type {Rule} from '../types'
import kebabCase from '../utils/kebabCase'

const ns = `fnValues${Date.now()}`

export default {
  onProcessRule(rule: Rule) {
    if (!(rule instanceof StyleRule)) return
    const {style} = rule
    const fnValues = {}
    for (const prop in style) {
      const value = style[prop]
      if (typeof value !== 'function') continue
      delete style[prop]
      fnValues[kebabCase(prop)] = value
    }
    // $FlowFixMe
    rule[ns] = fnValues
  },

  onUpdate(data: Object, rule: Rule) {
    // It is a rules container like for e.g. ConditionalRule.
    if (rule.rules instanceof RuleList) {
      rule.rules.update(data)
      return
    }
    if (!(rule instanceof StyleRule)) return
    // $FlowFixMe
    for (const prop in rule[ns]) {
      rule.prop(prop, rule[ns][prop](data))
    }
  }
}
