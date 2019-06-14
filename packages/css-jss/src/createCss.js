// @flow
import type {StyleSheet} from 'jss'
// eslint-disable-next-line no-unused-vars
import type {Css, StyleArg} from './types'

const createCss = (sheet: StyleSheet): Css => {
  const cache = new Map()
  let ruleIndex = 0

  return function css(/* :: ..._: StyleArg[] */): string {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments

    // We can avoid the need for stringification with a babel plugin,
    // which could generate a hash at build time and add it to the object.
    const argsStr = JSON.stringify(args)
    const cached = cache.get(argsStr)
    if (cached) return cached.className

    const flatArgs = []

    // Flatten arguments which can be
    // - style objects
    // - array of style objects
    // - arrays of style objects
    for (const argIndex in args) {
      const arg = args[argIndex]
      if (!Array.isArray(arg)) {
        flatArgs.push(arg)
        continue
      }
      for (let innerArgIndex = 0; innerArgIndex < arg.length; innerArgIndex++) {
        flatArgs.push(arg[innerArgIndex])
      }
    }

    const mergedStyle = {}
    const labels = []

    for (let i = 0; i < flatArgs.length; i++) {
      let style = flatArgs[i]
      if (!style) continue
      // It can be a class name that css() has previously generated.
      if (typeof style === 'string') {
        // eslint-disable-next-line no-shadow
        const cached = cache.get(style)
        if (cached) {
          // eslint-disable-next-line prefer-spread
          if (cached.labels.length) labels.push.apply(labels, cached.labels)
          style = cached.style
        }
      }
      if (style.label) labels.push(style.label)
      Object.assign(mergedStyle, style)
    }
    delete mergedStyle.label
    const label = labels.length === 0 ? 'css' : labels.join('-')
    const key = `${label}-${ruleIndex++}`
    sheet.addRule(key, mergedStyle)
    const className = sheet.classes[key]
    const cacheValue = {style: mergedStyle, labels, className}
    cache.set(argsStr, cacheValue)
    cache.set(className, cacheValue)
    return className
  }
}

export default createCss
