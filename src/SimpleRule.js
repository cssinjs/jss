import * as uid from './uid'

/**
 * Rule like @charset, @import, @namespace.
 *
 * @api private
 */
export default class SimpleRule {
  constructor(name, value, options) {
    this.id = uid.get()
    this.type = 'simple'
    this.name = name
    this.value = value
    this.options = options
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
