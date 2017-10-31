/* @flow */
import isObservable from 'is-observable'
import StyleRule from '../rules/StyleRule'
import createRule from '../utils/createRule'
import type {Observable, Rule, RuleOptions, JssStyle} from '../types'

export default {
  onCreateRule(name: string, decl: JssStyle | Observable<{[string]: string}>, options: RuleOptions) {
    if (isObservable(decl)) {
      const rule = createRule(name, {}, options);

      decl.subscribe(
        (currentProps) => {
          Object.entries(currentProps).forEach(
            ([key, value]) => rule.prop(key, value)
          );
        }
      );

      return rule;
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
