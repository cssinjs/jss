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

type StyleRuleWithFunctionValues = StyleRule & {
  [key: string]: {
    [key: string]: Function
  }
}

export default function functionPlugin() {
  return {
    onCreateRule(name: string, decl: JssStyle, options: RuleOptions): Rule | null {
      if (typeof decl !== 'function') return null
      const rule = ((createRule(name, {}, options): any): StyleRuleWithRuleFunction)
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
      rule = ((rule: any): StyleRuleWithFunctionValues)
      rule[fnValuesNs] = fnValues
      return style
    },

    onUpdate(data: Object, rule: Rule, sheet: StyleSheet, options: UpdateOptions) {
      // It is a rules container like for e.g. ConditionalRule.
      if (rule.rules instanceof RuleList) {
        rule.rules.update(data, options)
        return
      }

      rule = ((rule: any): StyleRuleWithRuleFunction)
      const fnRule = rule[fnRuleNs]

      // If we have a style function, the entire rule is dynamic and style object
      // will be returned from that function.
      if (fnRule) {
        const style = fnRule(data)

        // We need to run the plugins in case style relies on syntax plugins.
        if (options && options.process) {
          rule.options.jss.plugins.onProcessStyle(style, rule, sheet)
        }

        // Update, remove and add props.
        for (const prop in style) {
          rule.prop(prop, style[prop], options)
        }
      }

      rule = ((rule: any): StyleRuleWithFunctionValues)
      const fnValues = rule[fnValuesNs]

      // If we have a fn values map, it is a rule with function values.
      if (fnValues) {
        for (const prop in fnValues) {
          rule.prop(prop, fnValues[prop](data), options)
        }
      }
    }
  }
}
