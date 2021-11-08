import warning from 'tiny-warning'
import StyleSheet from './StyleSheet'
import sheets from './sheets'
import toCssValue from './utils/toCssValue'

/**
 * Cache the value from the first time a function is called.
 */
const memoize = (fn) => {
  let value
  return () => {
    if (!value) value = fn()
    return value
  }
}

/**
 * Get a style property value.
 */
const getPropertyValue = (cssRule, prop) => {
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
const setProperty = (cssRule, prop, value) => {
  try {
    let cssValue = value

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
const removeProperty = (cssRule, prop) => {
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
const setSelector = (cssRule, selectorText) => {
  cssRule.selectorText = selectorText

  // Return false if setter was not successful.
  // Currently works in chrome only.
  return cssRule.selectorText === selectorText
}

/**
 * Gets the `head` element upon the first call and caches it.
 * We assume it can't be null.
 */
const getHead = memoize(() => document.querySelector('head'))

/**
 * Find attached sheet with an index higher than the passed one.
 */
function findHigherSheet(registry, options) {
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
function findHighestSheet(registry, options) {
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
function findCommentNode(text) {
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
function findPrevNode(options) {
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
function insertStyle(style, options) {
  const {insertionPoint} = options
  const nextNode = findPrevNode(options)

  if (nextNode !== false && nextNode.parent) {
    nextNode.parent.insertBefore(style, nextNode.node)

    return
  }

  // Works with iframes and any node types.
  if (insertionPoint && typeof insertionPoint.nodeType === 'number') {
    const insertionPointElement = insertionPoint
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
const getNonce = memoize(() => {
  const node = document.querySelector('meta[property="csp-nonce"]')
  return node ? node.getAttribute('content') : null
})

const insertRule = (container, rule, index) => {
  try {
    if ('insertRule' in container) {
      container.insertRule(rule, index)
    }
    // Keyframes rule.
    else if ('appendRule' in container) {
      container.appendRule(rule)
    }
  } catch (err) {
    warning(false, `[JSS] ${err.message}`)
    return false
  }
  return container.cssRules[index]
}

const getValidRuleInsertionIndex = (container, index) => {
  const maxIndex = container.cssRules.length
  // In case previous insertion fails, passed index might be wrong
  if (index === undefined || index > maxIndex) {
    // eslint-disable-next-line no-param-reassign
    return maxIndex
  }
  return index
}

const createStyle = () => {
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

  hasInsertedRules = false

  // Will be empty if link: true option is not set, because
  // it is only for use together with insertRule API.
  cssRules = []

  constructor(sheet) {
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
  attach() {
    // In the case the element node is external and it is already in the DOM.
    if (this.element.parentNode || !this.sheet) return

    insertStyle(this.element, this.sheet.options)

    // When rules are inserted using `insertRule` API, after `sheet.detach().attach()`
    // most browsers create a new CSSStyleSheet, except of all IEs.
    const deployed = Boolean(this.sheet && this.sheet.deployed)
    if (this.hasInsertedRules && deployed) {
      this.hasInsertedRules = false
      this.deploy()
    }
  }

  /**
   * Remove style element from render tree.
   */
  detach() {
    if (!this.sheet) return
    const {parentNode} = this.element
    if (parentNode) parentNode.removeChild(this.element)
    // In the most browsers, rules inserted using insertRule() API will be lost when style element is removed.
    // Though IE will keep them and we need a consistent behavior.
    if (this.sheet.options.link) {
      this.cssRules = []
      this.element.textContent = '\n'
    }
  }

  /**
   * Inject CSS string into element.
   */
  deploy() {
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

  insertRules(rules, nativeParent) {
    for (let i = 0; i < rules.index.length; i++) {
      this.insertRule(rules.index[i], i, nativeParent)
    }
  }

  /**
   * Insert a rule into element.
   */
  insertRule(rule, index, nativeParent = this.element.sheet) {
    if (rule.rules) {
      const parent = rule
      let latestNativeParent = nativeParent
      if (rule.type === 'conditional' || rule.type === 'keyframes') {
        const insertionIndex = getValidRuleInsertionIndex(nativeParent, index)
        // We need to render the container without children first.
        latestNativeParent = insertRule(
          nativeParent,
          parent.toString({children: false}),
          insertionIndex
        )
        if (latestNativeParent === false) {
          return false
        }
        this.refCssRule(rule, insertionIndex, latestNativeParent)
      }
      this.insertRules(parent.rules, latestNativeParent)
      return latestNativeParent
    }

    const ruleStr = rule.toString()

    if (!ruleStr) return false

    const insertionIndex = getValidRuleInsertionIndex(nativeParent, index)
    const nativeRule = insertRule(nativeParent, ruleStr, insertionIndex)
    if (nativeRule === false) {
      return false
    }

    this.hasInsertedRules = true
    this.refCssRule(rule, insertionIndex, nativeRule)

    return nativeRule
  }

  refCssRule(rule, index, cssRule) {
    rule.renderable = cssRule
    // We only want to reference the top level rules, deleteRule API doesn't support removing nested rules
    // like rules inside media queries or keyframes
    if (rule.options.parent instanceof StyleSheet) {
      this.cssRules.splice(index, 0, cssRule)
    }
  }

  /**
   * Delete a rule.
   */
  deleteRule(cssRule) {
    const {sheet} = this.element
    const index = this.indexOf(cssRule)
    if (index === -1) return false
    sheet.deleteRule(index)
    this.cssRules.splice(index, 1)
    return true
  }

  /**
   * Get index of a CSS Rule.
   */
  indexOf(cssRule) {
    return this.cssRules.indexOf(cssRule)
  }

  /**
   * Generate a new CSS rule and replace the existing one.
   */
  replaceRule(cssRule, rule) {
    const index = this.indexOf(cssRule)
    if (index === -1) return false
    this.element.sheet.deleteRule(index)
    this.cssRules.splice(index, 1)
    return this.insertRule(rule, index)
  }

  /**
   * Get all rules elements.
   */
  getRules() {
    return this.element.sheet.cssRules
  }
}
