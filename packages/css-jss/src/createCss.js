// @flow
const createCss = sheet => {
  const cache = new Map()
  let ruleIndex = 0

  function css() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    // We can avoid the need for stringification with a babel plugin,
    // which could generate a has at build time and add it to the object.
    const cacheKey = JSON.stringify(args)
    const className = cache.get(cacheKey)

    if (className) return className

    const style = {}
    let label = 'css'

    for (const i in args) {
      const arg = args[i]
      if (arg) Object.assign(style, arg)
    }
    if ('label' in style) {
      label = style.label
      delete style.label
    }
    const key = `${label}${ruleIndex++}`
    sheet.addRule(key, style)
    return cache.set(cacheKey, sheet.classes[key])
  }

  return css
}

export default createCss
