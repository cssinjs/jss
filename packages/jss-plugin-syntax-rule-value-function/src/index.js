/* @flow */
import {RuleList, createRule, type Rule, type JssStyle, type RuleOptions, type StyleRule} from 'jss'

// A symbol replacement.
let now = Date.now()
const fnValuesNs = `fnValues${now}`
const fnStyleNs = `fnStyle${++now}`

type StyleRuleWithRuleFunction = StyleRule & {[key: string]: Function}

export default function functionPlugin() {
  return {
    onCreateRule(name: string, decl: JssStyle, options: RuleOptions): Rule | null {
      if (typeof decl !== 'function') return null
      const rule: StyleRuleWithRuleFunction = (createRule(name, {}, options): any)
      rule[fnStyleNs] = decl
      return rule
    },

    onProcessStyle(style: JssStyle, rule: Rule): JssStyle {
      const fn = {}
      for (const prop in style) {
        const value = style[prop]
        if (typeof value !== 'function') continue
        delete style[prop]
        fn[prop] = value
      }
      // $FlowFixMe: Flow complains...
      rule[fnValuesNs] = fn
      return style
    },

    onUpdate(data: Object, rule: Rule) {
      // It is a rules container like for e.g. ConditionalRule.
      if (rule.rules instanceof RuleList) {
        rule.rules.update(data)
        return
      }

      if (rule && rule.type !== 'style') return

      const styleRule: StyleRule = (rule: any)

      // If we have a fn values map, it is a rule with function values.
      // $FlowFixMe
      if (styleRule[fnValuesNs]) {
        for (const prop in styleRule[fnValuesNs]) {
          styleRule.prop(prop, styleRule[fnValuesNs][prop](data))
        }
      }

      // $FlowFixMe
      const fnStyle = styleRule[fnStyleNs]

      // If we have a style function, the entire rule is dynamic and style object
      // will be returned from that function.
      if (fnStyle) {
        const style = fnStyle(data)
        for (const prop in style) {
          styleRule.prop(prop, style[prop])
        }
      }
    }
  }
}
