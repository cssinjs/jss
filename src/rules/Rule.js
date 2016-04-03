import {clone, uid} from '../utils'

/**
 * Regular rules and font-face.
 *
 * @api public
 */
export default class Rule {
  constructor(selector, style, options) {
    this.id = uid.get()
    this.type = 'regular'
    this.options = options
    this.selector = selector
    if (options.named) {
      this.name = selector
      this.className = options.className || (this.name ? `${this.name}--${this.id}` : this.id)
      this.selector = `.${this.className}`
    }
    this.originalStyle = style
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
    const {style} = this.options.Renderer
    // Its a setter.
    if (value != null) {
      this.style[name] = value
      // If linked option in StyleSheet is not passed, renderable is not defined.
      if (this.renderable) style(this.renderable, name, value)
      return this
    }
    // Its a getter, read the value from the DOM if its not cached.
    if (this.renderable && this.style[name] == null) {
      // Cache the value after we have got it from the DOM once.
      this.style[name] = style(this.renderable, name)
    }
    return this.style[name]
  }

  /**
   * Apply rule to an element inline.
   *
   * @param {Element} renderable
   * @return {Rule}
   * @api public
   */
  applyTo(renderable) {
    for (const prop in this.style) {
      const value = this.style[prop]
      const {style} = this.options.Renderer
      if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
          style(renderable, prop, value[index])
        }
      }
      else style(renderable, prop, value)
    }
    return this
  }

  /**
   * Returns JSON representation of the rule.
   * Array of values is not supported.
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
   * Options:
   * - `selector` to get a rule without selector
   * - `indentationLevel` level of indentation
   *
   * @param {Object} options
   * @return {String}
   * @api public
   */
  toString(options = {}) {
    const selector = options.selector == null ? true : options.selector
    let indentationLevel = options.indentationLevel || 0
    let str = ''
    if (selector) {
      str += indent(indentationLevel, `${this.selector} {`)
      indentationLevel++
    }
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
    if (selector) str += '\n' + indent(--indentationLevel, '}')
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
  for (let index = 0; index < level; index++) indentStr += '  '
  return indentStr + str
}
