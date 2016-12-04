/* @-flow */

import warning from 'warning'
import sheets from '../sheets'

import type {
  Rule,
  StyleSheet,
} from '../types'

/**
 * Get or set a style property.
 *
 * @param {CSSStyleRule} element
 * @param {String} name
 * @param {String} [value]
 * @return {String|Boolean}
 * @api private
 */
function style(CSSStyleRule: CSSStyleRule, prop: string, value?: string): string | boolean {
  try {
    // It is a getter.
    if (value == null) return CSSStyleRule.style[prop]
    CSSStyleRule.style[prop] = value
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
function selector(CSSStyleRule: CSSStyleRule, selectorText?: string): string | boolean {
  // It is a getter.
  if (selectorText == null) return CSSStyleRule.selectorText

  CSSStyleRule.selectorText = selectorText

  // Return false if setter was not successful.
  // Currently works in chrome only.
  return CSSStyleRule.selectorText === selectorText
}

function findHigherSheet(registry: Array<StyleSheet>, index: number): StyleSheet | null {
  for (let i = 0; i < registry.length; i++) {
    const sheet = registry[i]
    if (sheet.attached && sheet.options.index > index) {
      return sheet
    }
  }
  return null
}

function findHighestSheet(registry: Array<StyleSheet>): StyleSheet | null {
  for (let i = registry.length - 1; i >= 0; i--) {
    const sheet = registry[i]
    if (sheet.attached) return sheet
  }
  return null
}

function findCommentNode(head: HTMLElement): Comment | null {
  for (let i = 0; i < head.childNodes.length; i++) {
    const node = head.childNodes[i]
    if (node instanceof Comment && node.nodeValue.trim() === 'jss') {
      return node
    }
  }
  return null
}

/**
 * Find a node before which we can insert the sheet.
 */
function findPrevNode(head: HTMLElement, index: number): HTMLElement | null {
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
  if (comment) return comment.nextSibling
  return null
}

export default class DomRenderer {
  style = style

  selector = selector

  // HTMLStyleElement needs fixing https://github.com/facebook/flow/issues/2696
  element: any

  head: HTMLElement

  sheet: ?StyleSheet

  constructor(sheet?: StyleSheet) {
    this.sheet = sheet
    // There is no sheet when the renderer is used from a standalone RegularRule.
    if (sheet) sheets.add(sheet)
  }

  /**
   * Create and ref style element.
   *
   * @api private
   */
  createElement(): void {
    const {media, meta, element} = (this.sheet ? this.sheet.options : {})
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
  attach(): void {
    // In the case the element node is external and it is already in the DOM.
    if (this.element.parentNode || !this.sheet) return
    const prevNode = findPrevNode(this.head, this.sheet.options.index)
    this.head.insertBefore(this.element, prevNode)
  }

  /**
   * Remove style element from render tree.
   *
   * @api private
   */
  detach(): void {
    this.element.parentNode.removeChild(this.element)
  }

  /**
   * Inject CSS string into element.
   *
   * @param {String} cssStr
   * @api private
   */
  deploy(sheet: StyleSheet): void {
    this.element.textContent = `\n${sheet.toString()}\n`
  }

  /**
   * Insert a rule into element.
   *
   * @param {Rule} rule
   * @return {CSSStyleRule}
   * @api private
   */
  insertRule(rule: Rule): CSSStyleRule {
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
  deleteRule(rule: CSSStyleRule): boolean {
    const {sheet} = this.element
    const {cssRules} = sheet
    for (let index = 0; index < cssRules.length; index++) {
      if (rule === cssRules[index]) {
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
  getRules(): CSSRuleList {
    return this.element.sheet.cssRules
  }
}
