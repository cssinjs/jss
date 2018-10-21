/* @flow */
import toCss from '../utils/toCss'
import type {CSSFontFaceRule, RuleOptions, JssStyle, ToCssOptions, BaseRule} from '../types'

export class FontFaceRule implements BaseRule {
  type = 'font-face'

  at: string = '@font-face'

  key: string

  style: JssStyle

  options: RuleOptions

  isProcessed: boolean = false

  renderable: ?CSSFontFaceRule

  constructor(key: string, style: JssStyle, options: RuleOptions) {
    this.key = key
    this.style = style
    this.options = options
  }

  /**
   * Generates a CSS string.
   */
  toString(options?: ToCssOptions): string {
    if (Array.isArray(this.style)) {
      let str = ''
      for (let index = 0; index < this.style.length; index++) {
        str += toCss(this.key, this.style[index])
        if (this.style[index + 1]) str += '\n'
      }
      return str
    }

    return toCss(this.key, this.style, options)
  }
}

export default {
  onCreateRule(key: string, style: JssStyle, options: RuleOptions): FontFaceRule | null {
    return key === '@font-face' ? new FontFaceRule(key, style, options) : null
  }
}
