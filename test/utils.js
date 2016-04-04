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

export const setup = {
  teardown: () => {
    jss.plugins.registry = []
    jss.sheets.registry = []
    jss.uid.reset()
  }
}
