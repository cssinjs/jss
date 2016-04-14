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
    return toCSS(this, options)
  }
}
