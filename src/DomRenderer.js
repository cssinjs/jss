/**
 * DOM rendering backend for StyleSheet.
 *
 * @api private
 */
export default class DomRenderer {
  constructor(options) {
    this.element = document.createElement('style')
    for (const attr in options) {
      if (options[attr]) this.element.setAttribute(attr, options[attr])
    }
  }

  /**
   * Insert style element into render tree.
   *
   * @api private
   */
  attach() {
    document.head.appendChild(this.element)
  }

  /**
   * Remove style element from render tree.
   *
   * @api private
   */
  detach() {
    this.element.parentNode.removeChild(this.element)
  }

  /**
   * Inject CSS string into element.
   *
   * @param {String} cssStr
   * @api private
   */
  deploy(sheet) {
    this.element.innerHTML = `\n${sheet.toString()}\n`
  }

  /**
   * Insert a rule into element.
   *
   * @param {Rule} rule
   * @return {CSSStyleRule}
   * @api private
   */
  insertRule(rule) {
    const {sheet} = this.element
    const {cssRules} = sheet
    const nextIndex = cssRules.length
    sheet.insertRule(rule.toString(), nextIndex)
    return cssRules[nextIndex]
  }

  /**
   * Get all rules elements.
   *
   * @return {Object} rules map, where key is selector, CSSStyleRule is value.
   * @api private
   */
  getRules() {
    const {cssRules} = this.element.sheet
    const rules = Object.create(null)
    for (let index = 0; index < cssRules.length; index++) {
      const CSSRule = cssRules[index]
      rules[CSSRule.selectorText] = CSSRule
    }
    return rules
  }
}

