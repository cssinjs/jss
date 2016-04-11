import jss from '../src'

/**
 * When comparing css text from DOM, IE8 generates:
 * - uppercased prop names and selectors
 * - no semicolon after last declaration
 * - weird whitespaces
 *
 * In order to compare somehow the DOM output with the desired result, we unify
 * the output.
 */
export function normalizeCssText(css) {
  return css.toLowerCase().replace(/\s|;/g, '')
}

export const mediaQueriesSupported = window.matchMedia && matchMedia('only all') !== null && matchMedia('only all').matches

export function getRules(el) {
  const sheet = el.sheet || el.styleSheet
  return sheet.rules || sheet.cssRules
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

export const setup = {
  teardown: () => {
    jss.plugins.registry = []
    jss.sheets.registry = []
    jss.uid.reset()
  }
}

