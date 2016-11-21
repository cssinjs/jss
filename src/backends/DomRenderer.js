import warning from 'warning'

/**
 * Get or set a style property.
 *
 * @param {CSSStyleRule} element
 * @param {String} name
 * @param {String} [value]
 * @return {String|Boolean}
 * @api private
 */
function style(CSSStyleRule, name, value) {
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
function selector(CSSStyleRule, selectorText) {
  // It is a getter.
  if (selectorText == null) return CSSStyleRule.selectorText

  CSSStyleRule.selectorText = selectorText

  // Return false if setter was not successful.
  // Currently works in chrome only.
  return CSSStyleRule.selectorText === selectorText
}

/**
 * DOM rendering backend for StyleSheet.
 *
 * @api private
 */
export default class DomRenderer {
  style = style
  selector = selector

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
    this.element.setAttribute('data-jss', '')
    if (media) this.element.setAttribute('media', media)
    if (meta) this.element.setAttribute('data-meta', meta)
  }

  /**
   * Insert style element into render tree.
   *
   * @api private
   */
  attach() {
    // In the case the element node is external and it is already in the DOM.
    if (this.element.parentNode) return

    let anchorEl = null

    const {index, jss} = this.options
    const {registry} = jss.sheets

    if (registry.length > 1) {
      // Try to insert by index if set
      if (typeof index === 'number') {
        for (let i = 0; i < registry.length; i++) {
          const sheet = registry[i]
          if (
            !sheet.attached ||
            typeof sheet.options.index !== 'number' ||
            sheet.options.index <= index
          ) continue
          anchorEl = sheet.renderer.element
          break
        }
      }

      // Otherwise insert after the last attached
      if (!anchorEl) {
        for (let i = registry.length - 1; i >= 0; i--) {
          const sheet = registry[i]
          if (sheet.attached) {
            anchorEl = sheet.renderer.element.nextElementSibling
            break
          }
        }
      }
    }

    if (!anchorEl) {
      // Try find a comment placeholder if registry is empty
      for (let i = 0; i < this.head.childNodes.length; i++) {
        const el = this.head.childNodes[i]
        if (el.nodeValue === 'jss') {
          anchorEl = el
          break
        }
      }
    }

    this.head.insertBefore(this.element, anchorEl)
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
    try {
      sheet.insertRule(rule.toString(), index)
    }
    catch (err) {
      warning(false, '[JSS] Can not insert an unsupported rule \n\r%s', rule.toString())
    }
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
