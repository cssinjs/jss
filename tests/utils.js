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
  // IE8 returns css from innerHTML even when inserted using addRule.
  return style.innerHTML.trim() ||
    getRules(style)
      .map(rule => rule.cssText)
      .join('')
      .trim()
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

export function reset() {
  jss.plugins.registry = []
  jss.sheets.registry = []
}

// Mock the hash function.
jss.setup({
  generateClassName: (str, rule) => (rule.name ? `${rule.name}-id` : 'id')
})
