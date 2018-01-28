/* @flow */
import StyleRule from '../rules/StyleRule'
import createRule from '../utils/createRule'
import isObservable from '../utils/isObservable'
import type { Observable, Rule, RuleOptions, JssStyle } from '../types'

export default {
  onCreateRule(
    name: string,
    decl: JssStyle,
    options: RuleOptions
  ): Rule | null {
    if (!isObservable(decl)) return null

    // Cast `decl` to `Observable`, since it passed the type guard.
    const style$ = (decl: Observable<{ [string]: string | number }>)

    const rule = ((createRule(name, {}, options): any): StyleRule)

    // TODO
    // Call `stream.subscribe()` returns a subscription, which should be explicitly
    // unsubscribed from when we know this sheet is no longer needed.
    style$.subscribe((style: JssStyle) => {
      for (const prop in style) {
        rule.prop(prop, style[prop])
      }
    })

    return rule
  },

  onProcessRule(rule: Rule) {
    if (!(rule instanceof StyleRule)) return
    const styleRule = ((rule: any): StyleRule)
    const { style } = styleRule
    for (const prop in style) {
      const value = style[prop]
      if (!isObservable(value)) continue
      delete style[prop]
      value.subscribe({
        next: nextValue => {
          styleRule.prop(prop, nextValue)
        },
      })
    }
  },
}
