/* @flow */
/**
 * Rule like @charset, @import, @namespace.
 *
 * @api public
 */
export default class SimpleRule {
  type: string = 'simple'
  name: string
  value: string
  options: Object

  constructor(name: string, value: string, options: Object) {
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
  toString(): string {
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
