/* @flow */
import toCss from '../utils/toCss'
import type {RuleOptions, JssStyle} from '../types'

export default class FontFaceRule {
  type = 'font-face'

  selector: string

  decl: JssStyle

  options: RuleOptions

  isProcessed: ?boolean

  constructor(selector: string, decl: JssStyle, options: RuleOptions) {
    this.selector = selector
    this.decl = decl
    this.options = options
  }

  /**
   * Generates a CSS string.
   */
  toString(): string {
    if (Array.isArray(this.decl)) {
      let str = ''
      for (let index = 0; index < this.decl.length; index++) {
        str += toCss(this.selector, this.decl[index])
        if (this.decl[index + 1]) str += '\n'
      }
      return str
    }

    return toCss(this.selector, this.decl)
  }
}
