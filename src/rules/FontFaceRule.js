import {uid, toCSS} from '../utils'

/**
 * Regular rules and font-face.
 *
 * @api public
 */
export default class Rule {
  constructor(selector, style, options) {
    this.id = uid.get()
    this.type = 'font-face'
    this.options = options
    this.selector = selector
    this.style = style
  }

  /**
   * Generates a CSS string.
   *
   * @see toCSS
   * @api public
   */
  toString(options) {
    let str = ''
    if (Array.isArray(this.style)) {
      for (let index = 0; index < this.style.length; index++) {
        str += toCSS(this.selector, this.style[index], options)
        str += '\n'
      }
      return str
    }

    return toCSS(this.selector, this.style, options)
  }
}
