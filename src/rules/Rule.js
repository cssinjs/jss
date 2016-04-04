import {clone, uid, toCSS} from '../utils'

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
   * @see toCSS
   * @api public
   */
  toString(options) {
    return toCSS(this, options)
  }
}
