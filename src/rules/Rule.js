import {clone, uid, toCSS} from '../utils'

/**
 * Regular rules.
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
   * Set selector string.
   * Attenition: use this with caution. Most browser didn't implement selector
   * text setter, so this will result in rerendering of entire style sheet.
   *
   * @param {String} selector
   * @api public
   */
  set selector(selector) {
    const {Renderer, sheet} = this.options

    // After we modify selector, ref by old selector needs to be removed.
    if (sheet) sheet.unregisterRule(this)

    this._selector = selector

    if (!this.renderable) {
      // Register the rule with new selector.
      if (sheet) sheet.registerRule(this)
      return
    }

    const changed = Renderer.setSelector(this.renderable, selector)

    if (changed) {
      sheet.registerRule(this)
      return
    }

    // If selector setter is not implemented, rerender the sheet.
    // We need to delete renderable from the rule, because when sheet.deploy()
    // calls rule.toString, it will get the old selector.
    delete this.renderable
    sheet
      .registerRule(this)
      .deploy()
      .link()
  }

  /**
   * Get selector string.
   *
   * @return {String}
   * @api public
   */
  get selector() {
    if (this.renderable) {
      return this.options.Renderer.getSelector(this.renderable)
    }

    return this._selector
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
      // Only defined if option linked is true.
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
