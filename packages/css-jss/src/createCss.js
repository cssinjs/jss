// @flow
const createCss = sheet => {
  const cache = new Map()
  let ruleIndex = 0

  function css() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    // We can avoid the need for stringification with a babel plugin,
    // which could generate a hash at build time and add it to the object.
    const cacheKey = JSON.stringify(args)
    let className = cache.get(cacheKey)

    if (className) return className

    const style = {}
    let label = 'css'

    for (const i in args) {
      const arg = args[i]
      if (arg) {
        if (arg.label) {
          label = label === 'css' ? arg.label : `${label}-${arg.label}`
        }
        Object.assign(style, arg)
      }
    }
    delete style.label
    const key = `${label}-${ruleIndex++}`
    sheet.addRule(key, style)
    className = sheet.classes[key]
    cache.set(cacheKey, className)
    return className
  }

  return css
}

export default createCss
