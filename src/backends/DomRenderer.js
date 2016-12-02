import warning from 'warning'
import {sheets} from '../index'

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

function findHigherSheet(registry, index) {
  for (let i = 0; i < registry.length; i++) {
    const sheet = registry[i]
    if (sheet.attached && sheet.options.index > index) {
      return sheet
    }
  }
  return null
}

function findHighestSheet(registry) {
  for (let i = registry.length - 1; i >= 0; i--) {
    const sheet = registry[i]
    if (sheet.attached) return sheet
  }
  return null
}

function findCommentNode(head) {
  for (let i = 0; i < head.childNodes.length; i++) {
    const el = head.childNodes[i]
    if (el.nodeValue === 'jss') return el
  }
  return null
}

/**
 * Find a node before which we can insert the sheet.
 */
function findPrevNode(head, index) {
  const {registry} = sheets

  if (registry.length > 1) {
    // Try to insert before the next higher sheet.
    let sheet = findHigherSheet(registry, index)
    if (sheet) return sheet.renderer.element

    // Otherwise insert after the last attached.
    sheet = findHighestSheet(registry)
    if (sheet) return sheet.renderer.element.nextElementSibling
  }

  // Try find a comment placeholder if registry is empty.
  const comment = findCommentNode(head)
  if (comment) return comment.nextElementSibling
  return null
}

/**
 * DOM rendering backend for StyleSheet.
 *
 * @api private
 */
export default class DomRenderer {
  style = style
  selector = selector

  constructor(sheet) {
    this.sheet = sheet
    // There is no sheet when the renderer is used from a standalone RegularRule.
    if (sheet) sheets.add(sheet)
  }

  /**
   * Create and ref style element.
   *
   * @api private
   */
  createElement() {
    const {media, meta, element} = this.sheet.options
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
    const prevNode = findPrevNode(this.head, this.sheet.options.index)
    this.head.insertBefore(this.element, prevNode)
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
    this.element.textContent = `\n${sheet}\n`
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
      sheet.insertRule(rule, index)
    }
    catch (err) {
      warning(false, '[JSS] Can not insert an unsupported rule \n\r%s', rule)
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
   * @return {Array} cssRules
   * @api private
   */
  getRules() {
    return this.element.sheet.cssRules
  }
}
