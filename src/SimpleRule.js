/**
 * Rule like @charset, @import, @namespace.
 *
 * @api private
 */
export default class SimpleRule {
  constructor(name, value, options) {
    this.type = 'simple'
    this.options = options
    this.name = name
    this.value = value
  }

  /**
   * Generates a CSS string.
   *
   * @return {String}
   * @api private
   */
  toString() {
    return `${this.name} ${this.value};`
  }
}
