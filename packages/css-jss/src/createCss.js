// @flow
import {create as createJss} from 'jss'
import preset from 'jss-preset-default'
import type {Jss} from 'jss'
// eslint-disable-next-line no-unused-vars
import type {Css, StyleArg} from './types'

// I have been trying to benchmark and I have seen a slow down after about 10k rules.
// Since we are in a single sheet mode, user shouldn't care about this.
const MAX_RULES_PER_SHEET = 10000

const defaultJss = createJss(preset())

const createCss = (jss: Jss = defaultJss): Css => {
  const cache = new Map()
  let ruleIndex = 0
  let sheet

  const getSheet = () => {
    if (!sheet || sheet.rules.index.length > MAX_RULES_PER_SHEET) {
      sheet = jss.createStyleSheet().attach()
    }
    return sheet
  }

  function css(/* :: ..._: StyleArg[] */): string {
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
      const style = flatArgs[i]
      if (!style) continue
      let styleObject = style
      // It can be a class name that css() has previously generated.
      if (typeof style === 'string') {
        // eslint-disable-next-line no-shadow
        const cached = cache.get(style)
        if (cached) {
          // eslint-disable-next-line prefer-spread
          if (cached.labels.length) labels.push.apply(labels, cached.labels)
          styleObject = cached.style
        }
      }
      if (styleObject.label && labels.indexOf(styleObject.label) === -1)
        labels.push(styleObject.label)
      Object.assign(mergedStyle, styleObject)
    }
    delete mergedStyle.label
    const label = labels.length === 0 ? 'css' : labels.join('-')
    const key = `${label}-${ruleIndex++}`
    getSheet().addRule(key, mergedStyle)
    const className = getSheet().classes[key]
    const cacheValue = {style: mergedStyle, labels, className}
    cache.set(argsStr, cacheValue)
    cache.set(className, cacheValue)
    return className
  }

  // For testing only.
  css.getSheet = getSheet

  return css
}

export default createCss
