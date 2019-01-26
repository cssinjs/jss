/* @flow */
import $$observable from 'symbol-observable'
import {
  createRule,
  type StyleRule,
  type Rule,
  type RuleOptions,
  type JssStyle,
  type UpdateOptions
} from 'jss'
import type {Observable} from './types'

const isObservable = (value: any) => value && value[$$observable] && value === value[$$observable]()

export type Options = UpdateOptions

function getObservableStyles(styles: Object): Object | null {
  let to = null

  for (const key in styles) {
    const value = styles[key]
    const type = typeof value

    if (isObservable(value)) {
      if (!to) to = {}
      to[key] = value
    } else if (type === 'object' && value !== null && !Array.isArray(value)) {
      const extracted = getObservableStyles(value)
      if (extracted) {
        if (!to) to = {}
        to[key] = extracted
      }
    }
  }

  return to
}

export {isObservable, getObservableStyles}

export default function observablePlugin(updateOptions?: Options) {
  return {
    onCreateRule(name?: string, decl: JssStyle, options: RuleOptions): Rule | null {
      if (!isObservable(decl)) return null

      // Cast `decl` to `Observable`, since it passed the type guard.
      const style$ = (decl: Observable<{[string]: string | number}>)

      const rule = ((createRule(name, {}, options): any): StyleRule)

      // TODO
      // Call `stream.subscribe()` returns a subscription, which should be explicitly
      // unsubscribed from when we know this sheet is no longer needed.
      style$.subscribe((style: JssStyle) => {
        for (const prop in style) {
          rule.prop(prop, style[prop], updateOptions)
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
            styleRule.prop(prop, nextValue, updateOptions)
          }
        })
      }
    }
  }
}
