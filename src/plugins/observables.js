/* @flow */
import isObservable from 'is-observable'
import StyleRule from '../rules/StyleRule'
import createRule from '../utils/createRule'
import type {Observable, Rule, RuleOptions, JssStyle} from '../types'

export default {
  onCreateRule(name: string, decl: JssStyle, options: RuleOptions): Rule | null {
    if (isObservable(decl)) {
      // Cast `decl` to `Observable`, since it passed the type guard
      const props$ = (decl: Observable<{[string]: string}>)

      // We know `rule` is a `StyleRule`, and the other types don't have a
      // `prop` method, so we must explicitly cast to `StyleRule`
      const rule = ((createRule(name, {}, options): any): StyleRule)

      // `stream.subscribe()` returns a subscription, which should be explicitly
      // unsubscribed from when we know this sheet is no longer needed, but I
      // don't see any hooks to do that in the plugin API.  The Observable props
      // implementation doesn't store its subscription either, so this is a TODO
      // for both.
      props$.subscribe(
        (props) => {
          Object.entries(props).forEach(
            // The typing here is gross because `Object.entries` is typed as
            // `[string, mixed]`, even though `props` is `{[string]: string}`
            ([key, value]) => rule.prop(key, ((value: any): string))
          )
        }
      )

      return rule
    } else {
      return null
    }
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
