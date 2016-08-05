/**
 * DOM rendering backend for StyleSheet.
 *
 * @api private
 */
export default class DomRenderer {
  constructor(options) {
    this.options = options
  }

  /**
   * Create and ref style element.
   *
   * @api private
   */
  createElement() {
    const {media, meta, element} = this.options
    this.head = document.head || document.getElementsByTagName('head')[0]
    this.element = element || document.createElement('style')
    this.element.type = 'text/css'
    if (media) this.element.setAttribute('media', media)
    if (meta) this.element.setAttribute('data-meta', meta)
  }

  /**
   * Get or set a style property.
   *
   * @param {CSSStyleRule} element
   * @param {String} name
   * @param {String} [value]
   * @return {String|Boolean}
   * @api private
   */
  style(CSSStyleRule, name, value) {
    try {
      // It is a getter.
      if (value == null) return CSSStyleRule.style[name]
      CSSStyleRule.style[name] = value
    }
    catch (err) {
      // IE may throw if property is unknown.
      return false
    }
    return true
  }

  /**
   * Get or set the selector.
   *
   * @param {CSSStyleRule} CSSStyleRule
   * @param {String} [selectorText]
   * @return {String|Boolean}
   * @api private
   */
  selector(CSSStyleRule, selectorText) {
    // It is a getter.
    if (selectorText == null) return CSSStyleRule.selectorText

    CSSStyleRule.selectorText = selectorText

    // Return false if setter was not successful.
    // Currently works in chrome only.
    return CSSStyleRule.selectorText === selectorText
  }

  /**
   * Insert style element into render tree.
   *
   * @api private
   */
  attach() {
    // In the case the element node is external and it is already in the DOM.
    if (this.element.parendNode) return
    this.head.appendChild(this.element)
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
    this.element.textContent = `\n${sheet.toString()}\n`
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
    const index = cssRules.length
    sheet.insertRule(rule.toString(), index)
    return cssRules[index]
  }

  /**
   * Delete a rule.
   *
   * @param {CSSStyleRule} rule
   * @return {Boolean} true if the rule was deleted
   * @api private
   */
  deleteRule(CSSStyleRule) {
    const {sheet} = this.element
    const {cssRules} = sheet
    for (let index = 0; index < cssRules.length; index++) {
      if (CSSStyleRule === cssRules[index]) {
        sheet.deleteRule(index)
        return true
      }
    }
    return false
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
      const CSSStyleRule = cssRules[index]
      rules[CSSStyleRule.selectorText] = CSSStyleRule
    }
    return rules
  }
}

