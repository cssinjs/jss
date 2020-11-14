// @flow
import toCss from '../utils/toCss'
import type {CSSViewportRule, RuleOptions, JssStyle, ToCssOptions, BaseRule} from '../types'

export class ViewportRule implements BaseRule {
  type: string = 'viewport'

  at: string = '@viewport'

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

export default {
  onCreateRule(key: string, style: JssStyle, options: RuleOptions): ViewportRule | null {
    return key === '@viewport' || key === '@-ms-viewport'
      ? new ViewportRule(key, style, options)
      : null
  }
}
