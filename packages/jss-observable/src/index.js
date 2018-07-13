/* @flow */
import $$observable from 'symbol-observable'
import type StyleRule from 'jss/src/rules/StyleRule'
import createRule from 'jss/lib/utils/createRule'
import type {Rule, RuleOptions, JssStyle} from '../../jss/src/types'
import type {Observable} from './types'

const isObservable = value => value && value[$$observable] && value === value[$$observable]()

export default function observable() {
  return {
    onCreateRule(name: string, decl: JssStyle, options: RuleOptions): Rule | null {
      if (!isObservable(decl)) return null

      // Cast `decl` to `Observable`, since it passed the type guard.
      const style$ = (decl: Observable<{[string]: string | number}>)

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
      if (rule && rule.type !== 'style') return

      const styleRule = ((rule: any): StyleRule)
      const {style} = styleRule
      for (const prop in style) {
        const value = style[prop]
        if (!isObservable(value)) continue
        delete style[prop]
        value.subscribe({
          next: nextValue => {
            styleRule.prop(prop, nextValue)
          }
        })
      }
    }
  }
}
