import {sheets as defaultSheets} from '../packages/jss/src'
import * as moduleIdExports from '../packages/jss/src/utils/moduleId'

export function resetModuleId() {
  moduleIdExports.default = 0
}

export function resetSheets(sheets = defaultSheets) {
  return () => {
    sheets.reset()

    const styles = document.head.querySelectorAll('[data-jss]')
    for (let i = 0; i < styles.length; i++) {
      document.head.removeChild(styles[i])
    }
  }
}

export function removeWhitespace(str) {
  return str.replace(/\s/g, '')
}

export function getRules(style) {
  const rulesArr = []
  const {cssRules} = style.sheet
  for (let index = 0; index < cssRules.length; index++) {
    if ([].hasOwnProperty.call(cssRules, index)) {
      rulesArr.push(cssRules[index])
    }
  }
  return rulesArr
}

export function getStyle() {
  return document.getElementsByTagName('style')[0]
}

export function getCss(style) {
  // IE doesn't provide correct `sheet.cssRules` when at-rules have been added
  // by using `.addRule()` API.
  // Others do not update .textContent result when `.addRule()` was used.
  const textContent = removeWhitespace(style.textContent)
  const cssText = getRules(style)
    .map(rule => removeWhitespace(rule.cssText))
    .join('')
  // We try to use the most complete version.
  // Potentially this is fragile too.
  return textContent.length > cssText.length ? textContent : cssText
}

/**
 * We need to remove vendor prefixes for some tests,
 * because some browsers automatically add them (like Mobile Safari 9.0.0)
 */
export function removeVendorPrefixes(str) {
  return str.replace(/-webkit-|-moz-|-o-|-ms-/g, '')
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

export const createGenerateId = () => rule => `${rule.key}-id`
