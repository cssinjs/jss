const sheetAttrs = ['title', 'type', 'media']

/**
 * Create style element, add attributes.
 *
 * @param {StyleSheet} sheet
 * @return {Element}
 * @api private
 */
export function createStyle(sheet) {
  const element = document.createElement('style')
  sheetAttrs.forEach(name => {
    if (sheet[name]) element.setAttribute(name, sheet[name])
  })
  return element
}

/**
 * Insert style element into head.
 *
 * @param {Element} element
 * @api private
 */
export function appendStyle(element) {
  document.head.appendChild(element)
}

/**
 * Get cssRules collection from a sheet
 *
 * @param {Element} element
 * @return {CSSRules}
 * @api private
 */
export function getCssRules(element) {
  return element && element.sheet && element.sheet.cssRules
}

/**
 * Insert a rule string into a style element.
 *
 * @param {Element} element
 * @param {String} ruleStr
 * @return {CSSRule}
 * @api private
 */
export function insertCssRule(element, ruleStr) {
  const rules = getCssRules(element)
  const nextIndex = rules.length
  element.sheet.insertRule(ruleStr, nextIndex)
  return rules[nextIndex]
}

/**
 * Remove element from the dom tree.
 *
 * @param {Element} element
 * @api private
 */
export function removeElement(element) {
  element.parentNode.removeChild(element)
}

function noDOM() {}
// For serverside rendering all functions will return undefined.
if (typeof document == 'undefined') {
  for (let name in exports) {
    if (typeof exports[name] == 'function') {
      exports[name] = noDOM
    }
  }
}
