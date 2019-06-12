// @flow
const createCss = (sheet, cache) => {
  let ruleIndex = 0

  function css() {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    const className = cache.get(args)

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
    return cache.set(args, sheet.classes[key])
  }

  return css
}

export default createCss
