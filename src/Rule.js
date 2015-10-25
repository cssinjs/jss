import * as uid from './uid'
import clone from './clone'

/**
 * Class name prefix when generated.
 *
 * @type {String}
 * @api private
 */
const namespacePrefix = 'jss'

/**
 * Indentation string for formatting toString output.
 *
 * @type {String}
 * @api private
 */
const indentWith = '  '

/**
 * Regular rule.
 *
 * @api private
 */
export default class Rule {
  constructor(selector, style, options) {
    this.type = 'regular'
    this.id = uid.get()
    this.options = options
    this.selector = selector
    if (options.named) {
      // Selector is a rule name, we need to ref it for e.g. for jss-debug.
      this.name = selector
      this.className = options.className || `${namespacePrefix}-${this.id}`
      this.selector = `.${this.className}`
    }
    // We expect style to be plain object.
    this.style = clone(style)
  }

  /**
   * Get or set a style property.
   *
   * @param {String} name
   * @param {String|Number} [value]
   * @return {Rule|String|Number}
   * @api public
   */
  prop(name, value) {
    // Its a setter.
    if (value != null) {
      this.style[name] = value
      // If linked option in StyleSheet is not passed, renderable is not defined.
      if (this.renderable) this.renderable.style[name] = value
      return this
    }
    // Its a getter, read the value from the DOM if its not cached.
    if (this.renderable && this.style[name] == null) {
      // Cache the value after we have got it from the DOM once.
      this.style[name] = this.renderable.style[name]
    }
    return this.style[name]
  }

  /**
   * Apply rule to an element inline.
   *
   * @param {Element} element
   * @return {Rule}
   * @api public
   */
  applyTo(element) {
    for (const prop in this.style) {
      const value = this.style[prop]
      if (Array.isArray(value)) {
        for (const index = 0; index < value.length; index++) {
          element.style[prop] = value[index]
        }
      }
      else element.style[prop] = value
    }
    return this
  }

  /**
   * Returns JSON representation of the rule.
   * Nested rules, at-rules and array values are not supported.
   *
   * @return {Object}
   * @api public
   */
  toJSON() {
    const style = Object.create(null)
    for (const prop in this.style) {
      if (typeof this.style[prop] != 'object') {
        style[prop] = this.style[prop]
      }
    }
    return style
  }

  /**
   * Generates a CSS string.
   *
   * @return {String}
   * @api private
   */
  toString({indentationLevel} = {indentationLevel: 0}) {
    let str = indent(indentationLevel, `${this.selector} {`)
    indentationLevel++
    for (const prop in this.style) {
      const value = this.style[prop]
      // We want to generate multiple style with identical property names.
      if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
          str += '\n' + indent(indentationLevel, `${prop}: ${value[index]};`)
        }
      }
      else str += '\n' + indent(indentationLevel, `${prop}: ${value};`)
    }
    str += '\n' + indent(--indentationLevel, '}')
    return str
  }
}

/**
 * Indent a string.
 *
 * http://jsperf.com/array-join-vs-for
 *
 * @param {Number} level
 * @param {String} str
 * @return {String}
 * @api private
 */
function indent(level, str) {
  let indentStr = ''
  for (let index = 0; index < level; index++) indentStr += indentWith
  return indentStr + str
}
