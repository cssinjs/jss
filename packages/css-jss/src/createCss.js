// @flow
const createCss = sheet => {
  const cache = new Map()
  let ruleIndex = 0

  return function css() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments

    // We can avoid the need for stringification with a babel plugin,
    // which could generate a hash at build time and add it to the object.
    const argsStr = JSON.stringify(args)
    let className = cache.get(argsStr)
    if (className) return className

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
    className = sheet.classes[key]
    cache.set(argsStr, className)
    cache.set(className, {style: mergedStyle, labels})
    return className
  }
}

export default createCss
