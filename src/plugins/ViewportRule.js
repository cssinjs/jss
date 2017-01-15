/* @flow */
import toCss from '../utils/toCss'
import type {RuleOptions} from '../types'

export default class ViewportRule {
  type = 'viewport'

  name: string

  style: Object

  options: RuleOptions

  isProcessed: ?boolean

  constructor(name: string, style: Object, options: RuleOptions) {
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
