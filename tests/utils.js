import {sheets} from '../src'

const {slice} = []

export function getRules(style) {
  return slice.call(style.sheet.cssRules)
}

export function getStyle() {
  return document.getElementsByTagName('style')[0]
}

export function getCss(style) {
  // IE doesn't provide correct rules list when at-rules have been added
  // by using `.addRule()` API.
  // Others do not update .innerHTML result when `.addRule()` was used.
  // We use what we can get.
  return removeWhitespace(style.innerHTML) ||
    getRules(style)
      .map(rule => removeWhitespace(rule.cssText))
      .join('')
}

export function getCssFromSheet(sheet) {
  return [...sheet.renderer.getRules()]
    .map(rule => removeWhitespace(rule.cssText))
    .join('')
}

/**
 * We need to remove vendor prefixes for some tests,
 * because some browsers automatically add them (like Mobile Safari 9.0.0)
 */
export function removeVendorPrefixes(str) {
  return str.replace(/-webkit-|-moz-|-o-|-ms-/g, '')
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

export const createGenerateClassName = () => rule => `${rule.key}-id`

// Make sure tests are isolated.
afterEach(() => {
  sheets.reset()

  const styles = document.head.querySelectorAll('[data-jss]')
  for (let i = 0; i < styles.length; i++) {
    document.head.removeChild(styles[i])
  }
})
