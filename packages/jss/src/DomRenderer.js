/* @flow */
import warning from 'tiny-warning'
import sheets from './sheets'
import toCssValue from './utils/toCssValue'
import type {
  CSSStyleRule,
  CSSMediaRule,
  CSSKeyframesRule,
  CSSKeyframeRule,
  HTMLElementWithStyleMap,
  AnyCSSRule,
  Rule,
  RuleList,
  ContainerRule,
  JssValue,
  InsertionPoint,
  StyleSheet
} from './types'

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
function getPropertyValue(
  cssRule: HTMLElementWithStyleMap | CSSStyleRule | CSSKeyframeRule,
  prop: string
): string {
  try {
    // Support CSSTOM.
    if (cssRule.attributeStyleMap) {
      return cssRule.attributeStyleMap.get(prop)
    }
    return cssRule.style.getPropertyValue(prop)
  } catch (err) {
    // IE may throw if property is unknown.
    return ''
  }
}

/**
 * Set a style property.
 */
function setProperty(
  cssRule: HTMLElementWithStyleMap | CSSStyleRule | CSSKeyframeRule,
  prop: string,
  value: JssValue
): boolean {
  try {
    let cssValue = ((value: any): string)

    if (Array.isArray(value)) {
      cssValue = toCssValue(value, true)

      if (value[value.length - 1] === '!important') {
        cssRule.style.setProperty(prop, cssValue, 'important')
        return true
      }
    }

    // Support CSSTOM.
    if (cssRule.attributeStyleMap) {
      cssRule.attributeStyleMap.set(prop, cssValue)
    } else {
      cssRule.style.setProperty(prop, cssValue)
    }
  } catch (err) {
    // IE may throw if property is unknown.
    return false
  }
  return true
}

/**
 * Remove a style property.
 */
function removeProperty(
  cssRule: HTMLElementWithStyleMap | CSSStyleRule | CSSKeyframeRule,
  prop: string
) {
  try {
    // Support CSSTOM.
    if (cssRule.attributeStyleMap) {
      cssRule.attributeStyleMap.delete(prop)
    } else {
      cssRule.style.removeProperty(prop)
    }
  } catch (err) {
    warning(
      false,
      `[JSS] DOMException "${err.message}" was thrown. Tried to remove property "${prop}".`
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
 * We assume it can't be null.
 */
const getHead = memoize((): HTMLElement => (document.querySelector('head'): any))

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
    if (sheet && sheet.renderer) {
      return {
        parent: sheet.renderer.element.parentNode,
        node: sheet.renderer.element
      }
    }

    // Otherwise insert after the last attached.
    sheet = findHighestSheet(registry, options)
    if (sheet && sheet.renderer) {
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
    warning(false, `[JSS] Insertion point "${insertionPoint}" not found.`)
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

const insertRule = (
  container: CSSStyleSheet | CSSMediaRule | CSSKeyframesRule,
  rule: string,
  index?: number
): false | any => {
  const maxIndex = container.cssRules.length
  // In case previous insertion fails, passed index might be wrong
  if (index === undefined || index > maxIndex) {
    // eslint-disable-next-line no-param-reassign
    index = maxIndex
  }

  try {
    if ('insertRule' in container) {
      const c = ((container: any): CSSStyleSheet)
      c.insertRule(rule, index)
    }
    // Keyframes rule.
    else if ('appendRule' in container) {
      const c = ((container: any): CSSKeyframesRule)
      c.appendRule(rule)
    }
  } catch (err) {
    warning(false, `[JSS] ${err.message}`)
    return false
  }
  return container.cssRules[index]
}

const createStyle = (): HTMLElement => {
  const el = document.createElement('style')
  // Without it, IE will have a broken source order specificity if we
  // insert rules after we insert the style tag.
  // It seems to kick-off the source order specificity algorithm.
  el.textContent = '\n'
  return el
}

export default class DomRenderer {
  getPropertyValue = getPropertyValue

  setProperty = setProperty

  removeProperty = removeProperty

  setSelector = setSelector

  // HTMLStyleElement needs fixing https://github.com/facebook/flow/issues/2696
  element: any

  sheet: StyleSheet | void

  hasInsertedRules: boolean = false

  constructor(sheet?: StyleSheet) {
    // There is no sheet when the renderer is used from a standalone StyleRule.
    if (sheet) sheets.add(sheet)

    this.sheet = sheet
    const {media, meta, element} = this.sheet ? this.sheet.options : {}
    this.element = element || createStyle()
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

    insertStyle(this.element, this.sheet.options)

    // When rules are inserted using `insertRule` API, after `sheet.detach().attach()`
    // browsers remove those rules.
    // TODO figure out if its a bug and if it is known.
    // Workaround is to redeploy the sheet.
    if (this.hasInsertedRules && !(this.sheet && !this.sheet.deployed)) {
      this.hasInsertedRules = false
      this.deploy()
    }
  }

  /**
   * Remove style element from render tree.
   */
  detach(): void {
    const {parentNode} = this.element
    if (parentNode) parentNode.removeChild(this.element)
  }

  /**
   * Inject CSS string into element.
   */
  deploy(): void {
    const {sheet} = this
    if (!sheet) return
    if (sheet.options.link) {
      this.insertRules(sheet.rules)
      return
    }
    this.element.textContent = `\n${sheet.toString()}\n`
  }

  /**
   * Insert RuleList into an element.
   */

  insertRules(rules: RuleList, nativeParent?: CSSStyleSheet | CSSMediaRule | CSSKeyframesRule) {
    for (let i = 0; i < rules.index.length; i++) {
      this.insertRule(rules.index[i], i, nativeParent)
    }
  }

  /**
   * Insert a rule into element.
   */
  insertRule(
    rule: Rule,
    index?: number,
    nativeParent?: CSSStyleSheet | CSSMediaRule | CSSKeyframesRule = this.element.sheet
  ): false | CSSStyleSheet | AnyCSSRule {
    if (rule.rules) {
      const parent: ContainerRule = (rule: any)
      let latestNativeParent = nativeParent
      if (rule.type === 'conditional' || rule.type === 'keyframes') {
        // We need to render the container without children first.
        latestNativeParent = insertRule(nativeParent, parent.toString({children: false}), index)
        if (latestNativeParent === false) {
          return false
        }
      }
      this.insertRules(parent.rules, latestNativeParent)
      return latestNativeParent
    }

    const ruleStr = rule.toString()

    if (!ruleStr) return false

    const nativeRule = insertRule(nativeParent, ruleStr, index)
    if (nativeRule === false) {
      return false
    }

    this.hasInsertedRules = true
    rule.renderable = nativeRule
    return nativeRule
  }

  /**
   * Delete a rule.
   */
  deleteRule(cssRule: AnyCSSRule): boolean {
    const {sheet} = this.element
    const index = this.indexOf(cssRule)
    if (index === -1) return false
    sheet.deleteRule(index)
    return true
  }

  /**
   * Get index of a CSS Rule.
   */
  indexOf(cssRule: AnyCSSRule): number {
    const {cssRules} = this.element.sheet
    for (let index = 0; index < cssRules.length; index++) {
      if (cssRule === cssRules[index]) return index
    }
    return -1
  }

  /**
   * Generate a new CSS rule and replace the existing one.
   *
   * Only used for some old browsers because they can't set a selector.
   */
  replaceRule(cssRule: AnyCSSRule, rule: Rule): false | CSSStyleSheet | AnyCSSRule {
    const index = this.indexOf(cssRule)
    if (index === -1) return false
    this.element.sheet.deleteRule(index)
    return this.insertRule(rule, index)
  }

  /**
   * Get all rules elements.
   */
  getRules(): CSSRuleList {
    return this.element.sheet.cssRules
  }
}
