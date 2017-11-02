/* @flow */
import StyleRule from '../rules/StyleRule'
import createRule from '../utils/createRule'
import isObservable from '../utils/isObservable'
import type {Observable, Rule, RuleOptions, JssStyle} from '../types'

export default {
  onCreateRule(name: string, decl: JssStyle, options: RuleOptions): Rule | null {
    if (!isObservable(decl)) return null

    // Cast `decl` to `Observable`, since it passed the type guard.
    const style$ = (decl: Observable<{[string]: string}>)

    // `style$` needs to be subscribed to before `rule` is created. Otherwise,
    // any emissions that occur synchronously will be called on an unlinked
    // `rule`, which will ignore them.
    let rule: StyleRule
    let initialStyle = {}

    // It can't be enumerable, otherwise it will be rendered.
    Object.defineProperty(initialStyle, 'isDynamic', {
      value: true,
      writable: false
    })

    // TODO
    // Call `stream.subscribe()` returns a subscription, which should be explicitly
    // unsubscribed from when we know this sheet is no longer needed.
    style$.subscribe((style: JssStyle) => {
      if (rule) {
        for (const prop in style) {
          rule.prop(prop, style[prop])
        }
      }
      else if (Object.keys(style).length) initialStyle = style
    })

    rule = (createRule(name, initialStyle, options): any)

    return rule
  },

  onProcessRule(rule: Rule) {
    if (!(rule instanceof StyleRule)) return
    const {style} = rule
    for (const prop in style) {
      const value = style[prop]
      if (!isObservable(value)) continue
      value.subscribe({
        next: (nextValue) => {
          // $FlowFixMe
          rule.prop(prop, nextValue)
        }
      })
    }
  }
}
