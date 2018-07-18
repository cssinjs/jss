// @flow
import type {Plugin} from 'jss'

/**
 * Tiny WeakMap like cache using arrays.
 * Required because we have frozen style objects in dev, which are not extensible,
 * so we can't put some key into that object.
 * Relies on [].indexOf(Object).
 */
class Cache {
  keys = []

  data = []

  get(key) {
    const index = this.keys.indexOf(key)
    return index === -1 ? null : this.data[index]
  }

  set(key, value) {
    this.keys.push(key)
    this.data.push(value)
  }
}

export default function cachePlugin(): Plugin {
  const cache = new Cache()

  function onCreateRule(name, decl, {parent}) {
    return parent ? cache.get(parent.rules.raw[name]) : null
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
