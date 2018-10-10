/* @flow */
import {
  RuleList,
  createRule,
  type Rule,
  type JssStyle,
  type RuleOptions,
  type UpdateOptions,
  type StyleRule,
  type StyleSheet
} from 'jss'

// A symbol replacement.
let now = Date.now()
const fnValuesNs = `fnValues${now}`
const fnRuleNs = `fnStyle${++now}`

type StyleRuleWithRuleFunction = StyleRule & {[key: string]: Function}

export default function functionPlugin() {
  return {
    onCreateRule(name: string, decl: JssStyle, options: RuleOptions): Rule | null {
      if (typeof decl !== 'function') return null
      const rule: StyleRuleWithRuleFunction = (createRule(name, {}, options): any)
      rule[fnRuleNs] = decl
      return rule
    },

    onProcessStyle(style: JssStyle, rule: Rule): JssStyle {
      const fnValues = {}
      for (const prop in style) {
        const value = style[prop]
        if (typeof value !== 'function') continue
        delete style[prop]
        fnValues[prop] = value
      }
      // $FlowFixMe
      rule[fnValuesNs] = fnValues
      return style
    },

    onUpdate(data: Object, rule: Rule, sheet: StyleSheet, options: UpdateOptions) {
      // It is a rules container like for e.g. ConditionalRule.
      if (rule.rules instanceof RuleList) {
        rule.rules.update(data, options)
        return
      }

      const styleRule: StyleRule = (rule: any)

      // $FlowFixMe
      const fnRule = styleRule[fnRuleNs]

      // If we have a style function, the entire rule is dynamic and style object
      // will be returned from that function.
      if (fnRule) {
        styleRule.style = fnRule(data)
      }

      // $FlowFixMe
      const fnValues = styleRule[fnValuesNs]

      // If we have a fn values map, it is a rule with function values.
      if (fnValues) {
        for (const prop in fnValues) {
          styleRule.prop(prop, fnValues[prop](data), options)
        }
      }
    }
  }
}
