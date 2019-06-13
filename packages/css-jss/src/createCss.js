// @flow
const createCss = sheet => {
  const cache = new Map()
  let ruleIndex = 0

  return function css() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
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

    // We can avoid the need for stringification with a babel plugin,
    // which could generate a hash at build time and add it to the object.
    const cacheKey = JSON.stringify(args)
    let className = cache.get(cacheKey)

    if (className) return className

    const style = {}
    let label = 'css'

    for (let i = 0; i < flatArgs.length; i++) {
      const arg = flatArgs[i]
      if (!arg) continue
      if (arg.label) {
        label = label === 'css' ? arg.label : `${label}-${arg.label}`
      }
      Object.assign(style, arg)
    }
    delete style.label
    const key = `${label}-${ruleIndex++}`
    sheet.addRule(key, style)
    className = sheet.classes[key]
    cache.set(cacheKey, className)
    return className
  }
}

export default createCss
