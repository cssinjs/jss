/* @flow */
import {RuleList, createRule, type Rule, type JssStyle, type RuleOptions, type StyleRule} from 'jss'

// A symbol replacement.
let now = Date.now()
const fnValuesNs = `fnValues${now}`
const fnStyleNs = `fnStyle${++now}`

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
      rule[fnStyleNs] = decl
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

    onUpdate(data: Object, rule: Rule) {
      // It is a rules container like for e.g. ConditionalRule.
      if (rule.rules instanceof RuleList) {
        rule.rules.update(data)
        return
      }

      if (rule && rule.type !== 'style') return

      rule = ((rule: any): StyleRuleWithFunctionValues)

      // If we have a fn values map, it is a rule with function values.
      if (rule[fnValuesNs]) {
        for (const prop in rule[fnValuesNs]) {
          rule.prop(prop, rule[fnValuesNs][prop](data))
        }
      }

      rule = ((rule: any): StyleRuleWithRuleFunction)

      const fnStyle = rule[fnStyleNs]

      // If we have a style function, the entire rule is dynamic and style object
      // will be returned from that function.
      if (fnStyle) {
        const style = fnStyle(data)
        // Update and add props.
        for (const prop in style) {
          rule.prop(prop, style[prop])
        }
        // Remove props.
        for (const prop in rule.style) {
          if (style[prop] == null) {
            rule.prop(prop, null)
          }
        }
      }
    }
  }
}
