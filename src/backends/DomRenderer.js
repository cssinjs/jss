/**
 * DOM rendering backend for StyleSheet.
 *
 * @api private
 */
export default class DomRenderer {
  static style(element, name, value) {
    try {
      if (value == null) return element.style[name]
      element.style[name] = value
    } catch (err) {
      // IE8 may throw if property is unknown.
    }
  }

  static setSelector(cssRule, selector) {
    cssRule.selectorText = selector

    // Return false if setter was not successful.
    // Currently works in chrome only.
    return cssRule.selectorText === selector
  }

  static getSelector(cssRule) {
    return cssRule.selectorText
  }

  constructor(options) {
    this.head = document.head || document.getElementsByTagName('head')[0]
    this.element = document.createElement('style')
    // IE8 will not have `styleSheet` prop without `type and `styleSheet.cssText`
    // is the only way to render on IE8.
    this.element.type = 'text/css'
    if (options.media) this.element.setAttribute('media', options.media)
    if (options.meta) this.element.setAttribute('data-meta', options.meta)
  }

  /**
   * Insert style element into render tree.
   *
   * @api private
   */
  attach() {
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
    const css = `\n${sheet.toString()}\n`
    if ('sheet' in this.element) this.element.innerHTML = css
    // On IE8 the only way to render is `styleSheet.cssText`.
    else if ('styleSheet' in this.element) this.element.styleSheet.cssText = css
  }

  /**
   * Insert a rule into element.
   *
   * @param {Rule} rule
   * @return {CSSStyleRule}
   * @api private
   */
  insertRule(rule) {
    // IE8 has only `styleSheet` and `styleSheet.rules`
    const sheet = this.element.sheet || this.element.styleSheet
    const cssRules = sheet.cssRules || sheet.rules
    const nextIndex = cssRules.length
    if (sheet.insertRule) sheet.insertRule(rule.toString(), nextIndex)
    else sheet.addRule(rule.selector, rule.toString({selector: false}), nextIndex)
    return cssRules[nextIndex]
  }

  /**
   * Get all rules elements.
   *
   * @return {Object} rules map, where key is selector, CSSStyleRule is value.
   * @api private
   */
  getRules() {
    // IE8 has only `styleSheet` and `styleSheet.rules`
    const sheet = this.element.sheet || this.element.styleSheet
    const cssRules = sheet.rules || sheet.cssRules
    const rules = Object.create(null)
    for (let index = 0; index < cssRules.length; index++) {
      const cssRule = cssRules[index]
      rules[cssRule.selectorText] = cssRule
    }
    return rules
  }
}

