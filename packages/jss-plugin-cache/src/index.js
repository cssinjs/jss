// @flow
import type {Plugin} from 'jss'

export default function cachePlugin(): Plugin {
  const cache = new WeakMap()

  function onCreateRule(name, decl, {parent}) {
    return parent && name ? cache.get(parent.rules.raw[name]) || null : null
  }

  function onProcessRule(rule) {
    const {
      options: {sheet, parent}
    } = rule

    if (!parent || (sheet && sheet.options.link)) {
      return
    }

    const originalStyle = parent.rules.raw[rule.key]

    if (!cache.get(originalStyle)) cache.set(originalStyle, rule)
  }

  return {onCreateRule, onProcessRule}
}
