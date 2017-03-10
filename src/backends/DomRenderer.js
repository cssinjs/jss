/* @flow */
import warning from 'warning'
import sheets from '../sheets'
import type StyleSheet from '../StyleSheet'
import type {Rule} from '../types'

type PriorityOptions = {
  index: number,
  insertionPoint: string
}

/**
 * Get a style property.
 */
function getStyle(rule: HTMLElement|CSSStyleRule, prop: string): string {
  try {
    return rule.style.getPropertyValue(prop)
  }
  catch (err) {
    // IE may throw if property is unknown.
    return ''
  }
}

/**
 * Set a style property.
 */
function setStyle(rule: HTMLElement|CSSStyleRule, prop: string, value: string): boolean {
  try {
    rule.style.setProperty(prop, value)
  }
  catch (err) {
    // IE may throw if property is unknown.
    return false
  }
  return true
}


/**
 * Get the selector.
 */
function getSelector(rule: CSSStyleRule): string {
  return rule.selectorText
}

/**
 * Set the selector.
 */
function setSelector(rule: CSSStyleRule, selectorText: string): boolean {
  rule.selectorText = selectorText

  // Return false if setter was not successful.
  // Currently works in chrome only.
  return rule.selectorText === selectorText
}

/**
 * Gets the `head` element upon the first call and caches it.
 */
const getHead = (() => {
  let head
  return (): HTMLElement => {
    if (!head) head = document.head || document.getElementsByTagName('head')[0]
    return head
  }
})()

/**
 * Find attached sheet with an index higher than the passed one.
 */
function findHigherSheet(registry: Array<StyleSheet>, options: PriorityOptions): StyleSheet|null {
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
function findHighestSheet(registry: Array<StyleSheet>, options: PriorityOptions): StyleSheet|null {
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
function findCommentNode(text: string): Comment|null {
  const head = getHead()
  for (let i = 0; i < head.childNodes.length; i++) {
    const node = head.childNodes[i]
    if (node.nodeType === 8 && node.nodeValue.trim() === text) {
      return node
    }
  }
  return null
}

/**
 * Find a node before which we can insert the sheet.
 */
function findPrevNode(options: PriorityOptions): ?Node|null {
  const {registry} = sheets

  if (registry.length > 0) {
    // Try to insert before the next higher sheet.
    let sheet = findHigherSheet(registry, options)
    if (sheet) return sheet.renderer.element

    // Otherwise insert after the last attached.
    sheet = findHighestSheet(registry, options)
    if (sheet) return sheet.renderer.element.nextElementSibling
  }

  // Try to find a comment placeholder if registry is empty.
  const comment = findCommentNode(options.insertionPoint)
  if (comment) return comment.nextSibling
  return null
}

export default class DomRenderer {
  getStyle = getStyle

  setStyle = setStyle

  setSelector = setSelector

  getSelector = getSelector

  // HTMLStyleElement needs fixing https://github.com/facebook/flow/issues/2696
  element: any

  sheet: ?StyleSheet

  constructor(sheet?: StyleSheet) {
    this.sheet = sheet
    // There is no sheet when the renderer is used from a standalone RegularRule.
    if (sheet) sheets.add(sheet)
  }

  /**
   * Create and ref style element.
   */
  createElement(): void {
    const {media, meta, element} = (this.sheet ? this.sheet.options : {})
    this.element = element || document.createElement('style')
    this.element.type = 'text/css'
    this.element.setAttribute('data-jss', '')
    if (media) this.element.setAttribute('media', media)
    if (meta) this.element.setAttribute('data-meta', meta)
  }

  /**
   * Insert style element into render tree.
   */
  attach(): void {
    // In the case the element node is external and it is already in the DOM.
    if (this.element.parentNode || !this.sheet) return
    const prevNode = findPrevNode(this.sheet.options)
    getHead().insertBefore(this.element, prevNode)
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
  deploy(sheet: StyleSheet): void {
    this.element.textContent = `\n${sheet.toString()}\n`
  }

  /**
   * Insert a rule into element.
   */
  insertRule(rule: Rule): CSSStyleRule|false {
    const {sheet} = this.element
    const {cssRules} = sheet
    const index = cssRules.length
    const str = rule.toString()

    if (!str) return false

    try {
      sheet.insertRule(str, index)
    }
    catch (err) {
      warning(false, '[JSS] Can not insert an unsupported rule \n\r%s', rule)
      return false
    }

    return cssRules[index]
  }

  /**
   * Delete a rule.
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
   */
  getRules(): CSSRuleList {
    return this.element.sheet.cssRules
  }
}
