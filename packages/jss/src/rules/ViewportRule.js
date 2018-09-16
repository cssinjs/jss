/* @flow */
import toCss from '../utils/toCss'
import type {CSSViewportRule, RuleOptions, JssStyle, ToCssOptions, BaseRule} from '../types'

export default class ViewportRule implements BaseRule {
  type = 'viewport'

  key: string

  style: JssStyle

  options: RuleOptions

  isProcessed: boolean = false

  renderable: ?CSSViewportRule

  constructor(key: string, style: JssStyle, options: RuleOptions) {
    this.key = key
    this.style = style
    this.options = options
  }

  /**
   * Generates a CSS string.
   */
  toString(options?: ToCssOptions): string {
    return toCss(this.key, this.style, options)
  }
}
