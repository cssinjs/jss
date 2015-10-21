export default class DomRenderer {
  constructor(options) {
    this.element = createStyle(options)
  }

  attach() {
    document.head.appendChild(this.element)
  }

  detach() {
    this.element.parentNode.removeChild(this.element)
  }

  insertRule(rule, options) {
    const DOMRule = insertCssRule(this.element, rule.toString())
    if (options.link) rule.DOMRule = DOMRule
  }

  deploy(cssStr) {
    this.element.innerHTML = `\n${cssStr}\n`
  }

  link(rules) {
    const cssRules = getCssRules(this.element)
    for (let i = 0; i < cssRules.length; i++) {
      const DOMRule = cssRules[i]
      let rule = rules[DOMRule.selectorText]
      if (rule) rule.DOMRule = DOMRule
    }
  }
}

/**
 * Create style element, add attributes.
 *
 * @param {StyleSheet} sheet
 * @return {Element}
 * @api private
 */
function createStyle(attrs) {
  const element = document.createElement('style')
  for (let attr in attrs) {
    if (attrs[attr]) element.setAttribute(attr, attrs[attr])
  }
  return element
}

/**
 * Get cssRules collection from a sheet
 *
 * @param {Element} element
 * @return {CSSRules}
 * @api private
 */
function getCssRules(element) {
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
function insertCssRule(element, ruleStr) {
  const rules = getCssRules(element)
  const nextIndex = rules.length
  element.sheet.insertRule(ruleStr, nextIndex)
  return rules[nextIndex]
}
