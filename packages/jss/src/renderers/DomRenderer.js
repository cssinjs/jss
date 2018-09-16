/* @flow */
import warning from 'warning'
import sheets from '../sheets'
import type StyleSheet from '../StyleSheet'
import type {CSSStyleRule, Rule, JssValue, InsertionPoint} from '../types'
import toCssValue from '../utils/toCssValue'

type PriorityOptions = {
  index: number,
  insertionPoint?: InsertionPoint
}

/**
 * Cache the value from the first time a function is called.
 */
const memoize = <Value>(fn: () => Value): (() => Value) => {
  let value
  return () => {
    if (!value) value = fn()
    return value
  }
}

/**
 * Get a style property value.
 */
function getPropertyValue(cssRule: HTMLElement | CSSStyleRule, prop: string): string {
  try {
    return cssRule.style.getPropertyValue(prop)
  } catch (err) {
    // IE may throw if property is unknown.
    return ''
  }
}

/**
 * Set a style property.
 */
function setProperty(cssRule: HTMLElement | CSSStyleRule, prop: string, value: JssValue): boolean {
  try {
    let cssValue = ((value: any): string)

    if (Array.isArray(value)) {
      cssValue = toCssValue(value, true)

      if (value[value.length - 1] === '!important') {
        cssRule.style.setProperty(prop, cssValue, 'important')
        return true
      }
    }

    cssRule.style.setProperty(prop, cssValue)
  } catch (err) {
    // IE may throw if property is unknown.
    return false
  }
  return true
}

/**
 * Remove a style property.
 */
function removeProperty(cssRule: HTMLElement | CSSStyleRule, prop: string) {
  try {
    cssRule.style.removeProperty(prop)
  } catch (err) {
    warning(
      false,
      '[JSS] DOMException "%s" was thrown. Tried to remove property "%s".',
      err.message,
      prop
    )
  }
}

/**
 * Set the selector.
 */
function setSelector(cssRule: CSSStyleRule, selectorText: string): boolean {
  cssRule.selectorText = selectorText

  // Return false if setter was not successful.
  // Currently works in chrome only.
  return cssRule.selectorText === selectorText
}

/**
 * Gets the `head` element upon the first call and caches it.
 */
const getHead = memoize(
  (): HTMLElement => document.head || document.getElementsByTagName('head')[0]
)

/**
 * Find attached sheet with an index higher than the passed one.
 */
function findHigherSheet(registry: Array<StyleSheet>, options: PriorityOptions): StyleSheet | null {
  for (let i = 0; i < registry.length; i++) {
    const sheet = registry[i]
    if (
      sheet.attached &&
      sheet.options.index > options.index &&
      sheet.options.insertionPoint === options.insertionPoint
    ) {
      return sheet
    }
  }
  return null
}

/**
 * Find attached sheet with the highest index.
 */
function findHighestSheet(
  registry: Array<StyleSheet>,
  options: PriorityOptions
): StyleSheet | null {
  for (let i = registry.length - 1; i >= 0; i--) {
    const sheet = registry[i]
    if (sheet.attached && sheet.options.insertionPoint === options.insertionPoint) {
      return sheet
    }
  }
  return null
}

/**
 * Find a comment with "jss" inside.
 */
function findCommentNode(text: string): Node | null {
  const head = getHead()
  for (let i = 0; i < head.childNodes.length; i++) {
    const node = head.childNodes[i]
    if (node.nodeType === 8 && node.nodeValue.trim() === text) {
      return node
    }
  }
  return null
}

type PrevNode = {
  parent: ?Node,
  node: ?Node
}

/**
 * Find a node before which we can insert the sheet.
 */
function findPrevNode(options: PriorityOptions): PrevNode | false {
  const {registry} = sheets

  if (registry.length > 0) {
    // Try to insert before the next higher sheet.
    let sheet = findHigherSheet(registry, options)
    if (sheet) {
      return {
        parent: sheet.renderer.element.parentNode,
        node: sheet.renderer.element
      }
    }

    // Otherwise insert after the last attached.
    sheet = findHighestSheet(registry, options)
    if (sheet) {
      return {
        parent: sheet.renderer.element.parentNode,
        node: sheet.renderer.element.nextSibling
      }
    }
  }

  // Try to find a comment placeholder if registry is empty.
  const {insertionPoint} = options
  if (insertionPoint && typeof insertionPoint === 'string') {
    const comment = findCommentNode(insertionPoint)
    if (comment) {
      return {
        parent: comment.parentNode,
        node: comment.nextSibling
      }
    }

    // If user specifies an insertion point and it can't be found in the document -
    // bad specificity issues may appear.
    warning(insertionPoint === 'jss', '[JSS] Insertion point "%s" not found.', insertionPoint)
  }

  return false
}

/**
 * Insert style element into the DOM.
 */
function insertStyle(style: HTMLElement, options: PriorityOptions) {
  const {insertionPoint} = options
  const nextNode = findPrevNode(options)

  if (nextNode !== false && nextNode.parent) {
    nextNode.parent.insertBefore(style, nextNode.node)

    return
  }

  // Works with iframes and any node types.
  if (insertionPoint && typeof insertionPoint.nodeType === 'number') {
    // https://stackoverflow.com/questions/41328728/force-casting-in-flow
    const insertionPointElement: HTMLElement = (insertionPoint: any)
    const {parentNode} = insertionPointElement
    if (parentNode) parentNode.insertBefore(style, insertionPointElement.nextSibling)
    else warning(false, '[JSS] Insertion point is not in the DOM.')
    return
  }

  getHead().appendChild(style)
}

/**
 * Read jss nonce setting from the page if the user has set it.
 */
const getNonce = memoize(
  (): ?string => {
    const node = document.querySelector('meta[property="csp-nonce"]')
    return node ? node.getAttribute('content') : null
  }
)

export default class DomRenderer {
  getPropertyValue = getPropertyValue

  setProperty = setProperty

  removeProperty = removeProperty

  setSelector = setSelector

  // HTMLStyleElement needs fixing https://github.com/facebook/flow/issues/2696
  element: any

  sheet: ?StyleSheet

  hasInsertedRules: boolean = false

  constructor(sheet?: StyleSheet) {
    // There is no sheet when the renderer is used from a standalone StyleRule.
    if (sheet) sheets.add(sheet)

    this.sheet = sheet
    const {media, meta, element} = this.sheet ? this.sheet.options : {}
    this.element = element || document.createElement('style')
    this.element.setAttribute('data-jss', '')
    if (media) this.element.setAttribute('media', media)
    if (meta) this.element.setAttribute('data-meta', meta)
    const nonce = getNonce()
    if (nonce) this.element.setAttribute('nonce', nonce)
  }

  /**
   * Insert style element into render tree.
   */
  attach(): void {
    // In the case the element node is external and it is already in the DOM.
    if (this.element.parentNode || !this.sheet) return

    // When rules are inserted using `insertRule` API, after `sheet.detach().attach()`
    // browsers remove those rules.
    // TODO figure out if its a bug and if it is known.
    // Workaround is to redeploy the sheet before attaching as a string.
    if (this.hasInsertedRules) {
      this.hasInsertedRules = false
      this.deploy()
    }

    insertStyle(this.element, this.sheet.options)
  }

  /**
   * Remove style element from render tree.
   */
  detach(): void {
    this.element.parentNode.removeChild(this.element)
  }

  /**
   * Inject CSS string into element.
   */
  deploy(): void {
    const {sheet} = this
    if (!sheet) return
    if (sheet.options.link) {
      // We can't use insertRule if style element is not in the DOM.
      this.attach()
      sheet.rules.index.forEach(this.insertRule, this)
      return
    }
    this.element.textContent = `\n${sheet.toString()}\n`
  }

  /**
   * Insert a rule into element.
   */
  insertRule(rule: Rule, index?: number): false | CSSStyleRule {
    const {sheet} = this.element
    const {cssRules} = sheet
    const str = rule.toString()
    if (!index) index = cssRules.length

    if (!str) return false

    try {
      sheet.insertRule(str, index)
    } catch (err) {
      warning(false, '[JSS] Can not insert an unsupported rule \n\r%s', rule)
      return false
    }
    this.hasInsertedRules = true

    const cssRule = cssRules[index]
    rule.renderable = cssRule
    return cssRule
  }

  /**
   * Delete a rule.
   */
  deleteRule(cssRule: CSSStyleRule): boolean {
    const {sheet} = this.element
    const index = this.indexOf(cssRule)
    if (index === -1) return false
    sheet.deleteRule(index)
    return true
  }

  /**
   * Get index of a CSS Rule.
   */
  indexOf(cssRule: CSSStyleRule): number {
    const {cssRules} = this.element.sheet
    for (let index = 0; index < cssRules.length; index++) {
      if (cssRule === cssRules[index]) return index
    }
    return -1
  }

  /**
   * Generate a new CSS rule and replace the existing one.
   */
  replaceRule(cssRule: CSSStyleRule, rule: Rule): false | CSSStyleRule {
    const index = this.indexOf(cssRule)
    const newCssRule = this.insertRule(rule, index)
    this.element.sheet.deleteRule(index)
    return newCssRule
  }

  /**
   * Get all rules elements.
   */
  getRules(): CSSRuleList {
    return this.element.sheet.cssRules
  }
}
