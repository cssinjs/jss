import toCss from '../utils/toCss'

/**
 * Font-face rules.
 *
 * @api public
 */
export default class FontFaceRule {
  type = 'font-face'

  constructor(selector, style, options) {
    this.selector = selector
    this.style = style
    this.options = options
  }

  /**
   * Generates a CSS string.
   *
   * @see toCss
   * @api public
   */
  toString(options) {
    if (Array.isArray(this.style)) {
      let str = ''
      for (let index = 0; index < this.style.length; index++) {
        str += toCss(this.selector, this.style[index], options)
        if (this.style[index + 1]) str += '\n'
      }
      return str
    }

    return toCss(this.selector, this.style, options)
  }
}
