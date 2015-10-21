/**
 * DOM rendering backend for StyleSheet.
 */
export default class DomRenderer {
  constructor(options) {
    this.element = document.createElement('style')
    for (let attr in options) {
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
   * Inject CSS string into style element.
   *
   * @param {String} cssStr
   * @api private
   */
  deploy(cssStr) {
    this.element.innerHTML = `\n${cssStr}\n`
  }

  /**
   * Insert a rule into style node.
   *
   * @param {String} ruleStr
   * @return {CSSStyleRule}
   * @api private
   */
  insertRule(ruleStr) {
    const {sheet} = this.element
    const {cssRules} = sheet
    const nextIndex = cssRules.length
    sheet.insertRule(ruleStr, nextIndex)
    return cssRules[nextIndex]
  }

  /**
   * Link all DOM Rule nodes with corresponding models.
   *
   * @return {Object} rules map, where key is selector, CSSStyleRule is value.
   * @api private
   */
  getRules() {
    const {cssRules} = this.element.sheet
    let rules = Object.create(null)
    for (let i = 0; i < cssRules.length; i++) {
      const CSSRule = cssRules[i]
      rules[CSSRule.selectorText] = CSSRule
    }
    return rules
  }
}

