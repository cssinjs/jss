import {uid} from '../utils'

/**
 * Rule like @charset, @import, @namespace.
 *
 * @api public
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
   * @api public
   */
  toString() {
    if (Array.isArray(this.value)) {
      let str = ''
      for (let index = 0; index < this.value.length; index++) {
        str += `${this.name} ${this.value[index]};`
        if (this.value[index + 1]) str += '\n'
      }
      return str
    }

    return `${this.name} ${this.value};`
  }
}
