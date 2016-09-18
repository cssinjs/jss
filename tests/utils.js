import jss from 'jss'

const {slice} = []

export function getRules(style) {
  const sheet = style.sheet || style.styleSheet
  const rules = sheet.rules || sheet.cssRules
  return slice.call(rules)
}

export function getStyle() {
  return document.getElementsByTagName('style')[0]
}

export function getCss(style) {
  // IE doesn't provide correct rules list when at-rules have been added
  // by using `.addRule()` api.
  // Others do not update .innerHTML result when `.addRule()` was used.
  // We use what we can get.
  return removeWhitespace(style.innerHTML) ||
    getRules(style)
      .map(rule => removeWhitespace(rule.cssText))
      .join('')
}

export function removeWhitespace(str) {
  return str.replace(/\s/g, '')
}

export function computeStyle(className) {
  const el = document.createElement('div')
  el.className = className
  document.body.appendChild(el)
  const style = window.getComputedStyle ? getComputedStyle(el) : el.currentStyle

  // This will work also for CSS2Properties from Firefox.
  const styleCopy = {}
  for (const key in style) styleCopy[key] = style[key]

  setTimeout(() => {
    document.body.removeChild(el)
  })

  return styleCopy
}

export function reset(jssInstance = jss) {
  jssInstance.plugins.registry = []
  jssInstance.sheets.registry.slice(0).forEach(jssInstance.removeStyleSheet, jssInstance)
}

// Mock the hash function.
jss.setup({
  generateClassName: (str, rule) => (rule.name ? `${rule.name}-id` : 'id')
})
