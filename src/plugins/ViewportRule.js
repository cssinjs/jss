/* @flow */
import toCss from '../utils/toCss'
import type {RuleOptions, JssStyle} from '../types'

export default class ViewportRule {
  type = 'viewport'

  name: string

  style: JssStyle

  options: RuleOptions

  isProcessed: ?boolean

  constructor(name: string, style: JssStyle, options: RuleOptions) {
    this.name = name
    this.style = style
    this.options = options
  }

  /**
   * Generates a CSS string.
   */
  toString(): string {
    return toCss(this.name, this.style)
  }
}
