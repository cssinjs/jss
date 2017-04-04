/* @flow */
import toCss from '../utils/toCss'
import type {RuleOptions, JssStyle} from '../types'

export default class FontFaceRule {
  type = 'font-face'

  selector: string

  style: JssStyle

  options: RuleOptions

  isProcessed: ?boolean

  constructor(selector: string, style: JssStyle, options: RuleOptions) {
    this.selector = selector
    this.style = style
    this.options = options
  }

  /**
   * Generates a CSS string.
   */
  toString(): string {
    if (Array.isArray(this.style)) {
      let str = ''
      for (let index = 0; index < this.style.length; index++) {
        str += toCss(this.selector, this.style[index])
        if (this.style[index + 1]) str += '\n'
      }
      return str
    }

    return toCss(this.selector, this.style)
  }
}
