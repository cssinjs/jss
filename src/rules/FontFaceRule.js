import {uid, toCSS} from '../utils'

/**
 * Font-face rules.
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
    if (Array.isArray(this.style)) {
      let str = ''
      for (let index = 0; index < this.style.length; index++) {
        str += toCSS(this.selector, this.style[index], options)
        if (this.style[index + 1]) str += '\n'
      }
      return str
    }

    return toCSS(this.selector, this.style, options)
  }
}
